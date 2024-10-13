import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { DefaultSession, NextAuthOptions } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import DiscordProvider from "next-auth/providers/discord";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import { env } from "process";
import { prisma } from "../lib/prisma-client";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      user_id: string;
      profile_photo?: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    user_id: string;
    profile_photo?: string | null;
  }
}

const options: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID as string,
      clientSecret: env.GOOGLE_CLIENT_SECRET as string,
    }),
    LinkedInProvider({
      clientId: env.LINKEDIN_CLIENT_ID as string,
      clientSecret: env.LINKEDIN_CLIENT_SECRET as string,
    }),
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID as string,
      clientSecret: env.DISCORD_CLIENT_SECRET as string,
    }),
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID as string,
      clientSecret: env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user_id = user.user_id || user.id;
        if (user.email) {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
          });
          token.profile_photo = user.image || dbUser?.profile_photo;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.user_id = token.user_id;
      session.user.profile_photo = token.profile_photo;
      return session;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    secret: env.NEXTAUTH_SECRET,
  },
  events: {
    async createUser(message) {
      const { user } = message;
      if (user.email) {
        await prisma.user.update({
          where: { email: user.email },
          data: { profile_photo: user.image },
        });
      } else {
        console.error("Invalid email for user creation event");
      }
    },
  },
};

export default options;
