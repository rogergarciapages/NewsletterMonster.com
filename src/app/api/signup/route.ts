import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../../../../lib/prisma-client";

interface ExtendedUser extends User {
  id: string;
  profile_photo?: string | null;
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) {
          return null;
        }

        const { email, password } = credentials;

        // Fetch user from Prisma
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (user && user.password === password) {
          const extendedUser: ExtendedUser = {
            id: user.user_id, // Map to id
            name: user.name,
            email: user.email,
            profile_photo: user.profile_photo,
          };
          return extendedUser;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      console.log("Session callback", { session, token });
      if (session.user) {
        session.user.id = token.id as string;
        session.user.image = (token.picture as string) || "/default-profile.png";
      }
      return session;
    },
    async jwt({ token, user }) {
      console.log("JWT callback", { token, user });
      if (user) {
        token.id = (user as ExtendedUser).id;
        token.picture = (user as ExtendedUser).profile_photo;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
});

export { handler as GET, handler as POST };

