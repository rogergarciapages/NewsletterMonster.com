import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { DefaultSession, NextAuthOptions } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import DiscordProvider from "next-auth/providers/discord";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import { env } from "process";
import { prisma } from "../lib/prisma-client";
import { generateUniqueUsername } from "../utils/username-generator";

// Extend the built-in session type
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      user_id: string;
    } & DefaultSession["user"]
  }
}

// Extend the built-in JWT type
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    user_id: string;
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
        token.user_id = user.user_id; // Ensure we use user_id
      }
      return token;
    },
    async session({ session, token }) {
      session.user.user_id = token.user_id;
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
      const username = await generateUniqueUsername();
      await prisma.user.update({
        where: { user_id: user.user_id },
        data: { username },
      });
    },
  },
};

export default options;
