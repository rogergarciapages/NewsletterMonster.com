// src/config/auth.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import type { User } from "next-auth";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import LinkedInProvider from "next-auth/providers/linkedin";

import { prisma } from "@/lib/prisma";

// Initialize PrismaAdapter with raw PrismaClient
const prismaWithoutExtensions = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
  log: ["error", "warn"],
});

interface AuthUser {
  id: string;
  name: string;
  email: string;
}

async function _signInCallback(_req: unknown, user: AuthUser) {
  if (user.email) {
    await prisma.user.update({
      where: { email: user.email },
      data: {
        last_login: new Date(),
        updated_at: new Date(),
        status: "active",
      },
    });
  }
}

interface GitHubProfile {
  id: number;
  email: string | null;
  name: string | null;
  login: string;
  avatar_url: string | null;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prismaWithoutExtensions),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("No user found");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.user_id,
          user_id: user.user_id,
          email: user.email,
          name: user.name,
          profile_photo: user.profile_photo,
          username: user.username,
          role: user.role,
          emailVerified: user.emailVerified,
          status: user.status,
        } as User;
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      profile(profile: GitHubProfile): User {
        return {
          id: profile.id.toString(),
          user_id: profile.id.toString(),
          email: profile.email!,
          name: profile.name ?? profile.login ?? profile.email?.split("@")[0] ?? "User",
          profile_photo: profile.avatar_url ?? null,
          username: profile.login,
          role: "FREE",
          emailVerified: null,
          status: "active",
        } as User;
      },
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      authorization: {
        params: { scope: "openid profile email" },
      },
      profile(profile) {
        return {
          id: profile.sub,
          user_id: profile.sub,
          name: profile.name,
          email: profile.email,
          profile_photo: profile.picture ?? null,
          username: null,
          role: "FREE",
          emailVerified: null,
          status: "active",
        } as User;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "github" || account?.provider === "linkedin") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
            include: {
              accounts: true,
            },
          });

          if (existingUser) {
            // Check if this provider account already exists
            const existingAccount = await prisma.account.findFirst({
              where: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            });

            // If account doesn't exist, create it
            if (!existingAccount) {
              await prisma.account.create({
                data: {
                  userId: existingUser.user_id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  token_type: account.token_type,
                  scope: account.scope,
                },
              });
            }
            return true;
          }
        } catch (error) {
          console.error("SignIn callback error:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          user_id: user.user_id,
          email: user.email,
          name: user.name,
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
          user_id: token.user_id as string,
          email: token.email,
          name: token.name,
          profile_photo: token.profile_photo as string | null,
          username: token.username as string | null,
          role: token.role as string,
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
            profile_photo: user.profile_photo || null,
            role: "FREE",
            status: "active",
            updated_at: new Date(),
            last_login: new Date(),
          },
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
            status: "active",
          },
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
