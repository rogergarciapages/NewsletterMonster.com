// src/config/auth.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import type { User } from "next-auth";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import LinkedInProvider from "next-auth/providers/linkedin";

import { fixPrismaAdapter } from "@/lib/auth/fix-prisma-adapter";
import prisma from "@/lib/prisma";

// Initialize PrismaClient for adapter
const prismaWithoutExtensions = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
  log: ["error", "warn"],
});

interface AuthUser {
  id: string;
  name: string;
  email: string;
}

// Profile type for LinkedIn OAuth
interface LinkedInProfile {
  sub: string;
  name: string;
  email: string;
  picture?: string;
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
  // Use our fixed adapter that corrects the field name issue
  adapter: fixPrismaAdapter(prismaWithoutExtensions),
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
        console.log("GitHub profile data:", {
          id: profile.id.toString(),
          email: profile.email,
          name: profile.name,
          login: profile.login,
        });

        // Make sure we have a valid ID string
        const userId = profile.id.toString();
        console.log("Setting GitHub user ID to:", userId);

        return {
          id: userId,
          user_id: userId, // Explicitly set user_id to match id
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
        params: { scope: "profile email" },
      },
      // Disable userinfo endpoint completely
      userinfo: undefined,
      // Do not use OpenID Connect
      idToken: false,
      checks: ["state"],
      // Remove wellKnown configuration
      // Extract user info directly from the token
      profile(profile, tokens) {
        console.log("LinkedIn OAuth token data:", {
          tokenAvailable: !!tokens.access_token,
          tokenPrefix: tokens.access_token ? `${tokens.access_token.substring(0, 10)}...` : "none",
          expiresAt: tokens.expires_at,
          scope: tokens.scope,
        });

        // Generate a consistent user ID based on timestamp and random string
        const userId = `linkedin-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
        console.log("Generated LinkedIn user ID:", userId);

        // Use a synthetic email address based on user ID
        const email = `linkedin-${userId}@example.com`;

        console.log("LinkedIn profile data created:", {
          id: userId,
          name: "LinkedIn User",
          email,
        });

        return {
          id: userId,
          user_id: userId,
          name: "LinkedIn User",
          email: email,
          profile_photo: null,
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
      console.log("SignIn callback executing for:", account?.provider);
      console.log("User data received:", { id: user.id, email: user.email, name: user.name });

      // For OAuth providers, ensure the user is properly created
      if (account?.provider === "github" || account?.provider === "linkedin") {
        try {
          // Check if user already exists by email
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (existingUser) {
            console.log("Found existing user:", existingUser.user_id);

            // Ensure the user_id is set properly for the session
            user.user_id = existingUser.user_id;

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
          } else {
            // This is a new user, the adapter will create it automatically
            console.log("No existing user found - a new one will be created");
          }
          return true;
        } catch (error) {
          console.error("SignIn callback error:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        console.log("JWT callback - user data:", {
          id: user.id,
          user_id: user.user_id,
          email: user.email,
        });

        // Ensure user_id is set correctly
        const userId = user.user_id || user.id;
        console.log("Setting user_id in token to:", userId);

        return {
          ...token,
          user_id: userId,
          email: user.email,
          name: user.name,
          profile_photo: user.profile_photo || user.image,
          username: user.username,
          role: user.role || "FREE",
          accessToken: account.access_token,
        };
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Session callback - token data:", { user_id: token.user_id, email: token.email });

      if (!token.user_id) {
        console.warn("WARNING: token.user_id is undefined in session callback");
      }

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
    async redirect({ url, baseUrl }) {
      // No longer redirecting to onboarding
      // Just use default NextAuth behavior
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return baseUrl;
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
