import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { env } from "process";
import { prisma } from "../../lib/prisma-client";

const options: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID as string,
      clientSecret: env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.picture = (user as Partial<{ image: string }>).image;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.image = (token.picture as string) ?? "/default-profile.png";
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    secret: env.NEXTAUTH_SECRET,
  },
};

export default options;
