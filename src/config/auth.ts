// src/config/auth.ts
import { prisma } from "@/lib/prisma-client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("No user found");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.user_id,
          user_id: user.user_id,
          email: user.email,
          name: user.name,
          image: user.profile_photo,
          profile_photo: user.profile_photo,
          username: user.username,
          role: user.role,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      },
      profile(profile) {
        return {
          id: profile.sub,
          user_id: profile.sub,
          email: profile.email!,
          name: profile.name ?? profile.email?.split("@")[0] ?? "User",
          image: profile.picture ?? null,
          profile_photo: profile.picture ?? null,
          username: null,
          role: "FREE",
          emailVerified: profile.email_verified ? new Date() : null,
        };
      },
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid profile email"
        }
      },
      profile(profile) {
        return {
          id: profile.sub,
          user_id: profile.sub,
          email: profile.email!,
          name: profile.name ?? profile.email?.split("@")[0] ?? "User",
          image: profile.picture ?? null,
          profile_photo: profile.picture ?? null,
          username: null,
          role: "FREE",
          emailVerified: null,
        };
      },
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      profile(profile) {
        const avatarUrl = profile.avatar 
          ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
          : null;

        return {
          id: profile.id,
          user_id: profile.id,
          email: profile.email!,
          name: profile.username ?? profile.email?.split("@")[0] ?? "User",
          image: avatarUrl,
          profile_photo: avatarUrl,
          username: profile.username,
          role: "FREE",
          emailVerified: profile.verified ? new Date() : null,
        };
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: String(profile.id),
          user_id: String(profile.id),
          email: profile.email!,
          name: profile.name ?? profile.login ?? profile.email?.split("@")[0] ?? "User",
          image: profile.avatar_url ?? null,
          profile_photo: profile.avatar_url ?? null,
          username: profile.login,
          role: "FREE",
          emailVerified: null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          user_id: user.user_id,
          email: user.email,
          name: user.name,
          picture: user.image,
          profile_photo: user.profile_photo,
          username: user.username,
          role: user.role,
          accessToken: account.access_token,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          user_id: token.user_id,
          email: token.email,
          name: token.name,
          image: token.picture,
          profile_photo: token.profile_photo,
          username: token.username,
          role: token.role,
        },
      };
    },
  },
  events: {
    async createUser({ user }) {
      if (user.email) {
        await prisma.user.update({
          where: { email: user.email },
          data: {
            profile_photo: user.image || null,
            role: "FREE",
            status: "active",
            updated_at: new Date(),
            last_login: new Date()
          }
        });
      }
    },
    async signIn({ user }) {
      if (user.email) {
        await prisma.user.update({
          where: { email: user.email },
          data: {
            last_login: new Date(),
            updated_at: new Date(),
            status: "active"
          }
        });
      }
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
  debug: process.env.NODE_ENV === "development",
};

export default authOptions;