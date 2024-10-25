import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import { prisma } from "../lib/prisma-client";

const options: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        // Handle initial sign in
        token.user_id = user.user_id;
        token.email = user.email;
        token.name = user.name;
        token.profile_photo = user.profile_photo;
        token.role = user.role;
        
        if (account?.provider) {
          // Update profile photo from OAuth provider if available
          const profile_photo = user.image || user.profile_photo;
          if (profile_photo && user.email) {
            await prisma.user.update({
              where: { email: user.email },
              data: { profile_photo }
            });
            token.profile_photo = profile_photo;
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.user_id = token.user_id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.profile_photo = token.profile_photo;
        session.user.role = token.role;
      }
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
  secret: process.env.NEXTAUTH_SECRET,
  events: {
    async createUser({ user }) {
      if (user.email && user.image) {
        await prisma.user.update({
          where: { email: user.email },
          data: {
            profile_photo: user.image,
            role: "FREE"
          },
        });
      }
    },
  },
};

export default options;