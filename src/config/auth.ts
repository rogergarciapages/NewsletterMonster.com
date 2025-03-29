// src/config/auth.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import type { User } from "next-auth";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
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
          avatar_url: profile.avatar_url,
        });

        // Make sure we have a valid ID string
        const userId = profile.id.toString();
        console.log("Setting GitHub user ID to:", userId);

        // Get high-res version of GitHub avatar by removing size parameter if present
        const profilePhoto = profile.avatar_url
          ? profile.avatar_url.replace(/\?.*$/, "") // Remove any query parameters
          : null;

        console.log("Using GitHub profile photo:", profilePhoto);

        return {
          id: userId,
          user_id: userId, // Explicitly set user_id to match id
          email: profile.email!,
          name: profile.name ?? profile.login ?? profile.email?.split("@")[0] ?? "User",
          profile_photo: profilePhoto,
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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        console.log("Google profile data:", {
          sub: profile.sub,
          name: profile.name,
          email: profile.email,
          picture: profile.picture,
          raw: profile,
        });

        // Get a higher resolution image by modifying the URL
        const profilePhoto = profile.picture ? profile.picture.replace("=s96-c", "=s400-c") : null;

        console.log("Using Google profile photo:", profilePhoto);

        const userId = profile.sub;
        return {
          id: userId,
          user_id: userId,
          email: profile.email!,
          name: profile.name ?? profile.email?.split("@")[0] ?? "User",
          profile_photo: profilePhoto,
          username: null,
          role: "FREE",
          emailVerified: profile.email_verified ? new Date() : null,
          status: "active",
        } as User;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("SignIn callback executing for:", account?.provider);
      console.log("User data received:", {
        id: user.id,
        email: user.email,
        name: user.name,
        profile: profile,
      });

      // For OAuth providers, ensure the user is properly created/updated
      if (
        account?.provider === "github" ||
        account?.provider === "linkedin" ||
        account?.provider === "google"
      ) {
        try {
          // Check if user already exists by email
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          // Get the profile photo based on provider
          let profilePhoto = user.profile_photo;

          if (existingUser) {
            console.log("Found existing user:", existingUser.user_id);

            // If user exists and has a custom photo, use that instead of provider's photo
            if (existingUser.profile_photo) {
              profilePhoto = existingUser.profile_photo;
              console.log("Using existing custom profile photo:", profilePhoto);
            } else if (account.provider === "github" && profile) {
              // Only use GitHub photo if user has no custom photo
              const githubProfile = profile as GitHubProfile;
              profilePhoto = githubProfile.avatar_url
                ? githubProfile.avatar_url.replace(/\?.*$/, "") // Remove any query parameters
                : null;
              console.log("Using GitHub avatar URL:", profilePhoto);
            } else if (account.provider === "google" && profile) {
              // Only use Google photo if user has no custom photo
              const googleProfile = profile as any;
              profilePhoto = googleProfile.picture
                ? googleProfile.picture.replace("=s96-c", "=s400-c")
                : null;
              console.log("Using Google profile photo:", profilePhoto);
            }

            // Update the user's data but keep their existing photo if they have one
            await prisma.user.update({
              where: { user_id: existingUser.user_id },
              data: {
                name: user.name,
                profile_photo: profilePhoto, // This will now prioritize existing custom photo
                updated_at: new Date(),
                last_login: new Date(),
              },
            });

            // Update the user object with the correct photo
            user.profile_photo = profilePhoto;
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
            // This is a new user, create it with provider's profile photo
            if (account.provider === "github" && profile) {
              const githubProfile = profile as GitHubProfile;
              profilePhoto = githubProfile.avatar_url
                ? githubProfile.avatar_url.replace(/\?.*$/, "")
                : null;
            } else if (account.provider === "google" && profile) {
              const googleProfile = profile as any;
              profilePhoto = googleProfile.picture
                ? googleProfile.picture.replace("=s96-c", "=s400-c")
                : null;
            }

            const newUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name!,
                profile_photo: profilePhoto,
                role: "FREE",
                status: "active",
                last_login: new Date(),
              },
            });

            user.user_id = newUser.user_id;
            user.profile_photo = profilePhoto;
          }

          console.log("Updated user data:", {
            user_id: user.user_id,
            email: user.email,
            profile_photo: user.profile_photo,
          });

          return true;
        } catch (error) {
          console.error("SignIn callback error:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account, profile, trigger }) {
      console.log("JWT Callback - Token:", token);
      console.log("JWT Callback - User:", user);
      console.log("JWT Callback - Account:", account);
      console.log("JWT Callback - Profile:", profile);

      // If this is a sign-in
      if (account && user) {
        // Handle profile photos based on provider
        if (account.provider === "google" && profile) {
          // For Google, use high-res version of the profile picture
          const profilePhoto = profile.picture
            ? profile.picture.replace("=s96-c", "=s400-c")
            : null;
          token.picture = profilePhoto;
          token.profile_photo = profilePhoto;
        } else if (account.provider === "github" && user.profile_photo) {
          // For GitHub, use the avatar_url which is already high-res
          token.picture = user.profile_photo;
          token.profile_photo = user.profile_photo;
        } else if (user.profile_photo) {
          // For other providers or direct login
          token.picture = user.profile_photo;
          token.profile_photo = user.profile_photo;
        }

        // Set other token fields
        token.user_id = user.user_id;
        token.role = user.role;
        token.username = user.username;
        token.accessToken = account.access_token;
      }

      // If this is a forced refresh
      if (trigger === "update") {
        const dbUser = await prisma.user.findUnique({
          where: { user_id: token.user_id as string },
          select: {
            profile_photo: true,
            role: true,
            status: true,
            username: true,
          },
        });

        if (dbUser) {
          token.profile_photo = dbUser.profile_photo;
          token.picture = dbUser.profile_photo;
          token.role = dbUser.role;
          token.username = dbUser.username;
        }
      }

      // Log the user data we're storing in the token
      console.log("JWT callback - user data:", {
        id: token.sub,
        user_id: token.user_id,
        email: token.email,
        profile_photo: token.profile_photo,
        username: token.username,
      });

      return token;
    },
    async session({ session, token }) {
      // Log the token data we're using to build the session
      console.log("Session callback - token data:", {
        user_id: token.user_id,
        email: token.email,
        profile_photo: token.profile_photo || token.picture,
      });

      if (token) {
        session.user = {
          ...session.user,
          user_id: token.user_id as string,
          email: token.email as string,
          name: token.name as string,
          profile_photo: token.profile_photo || token.picture,
          username: token.username as string | null,
          role: token.role as string,
          emailVerified: token.emailVerified as Date | null,
        };
      }

      return session;
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
      console.log("Create user event:", {
        email: user.email,
        name: user.name,
        profile_photo: user.profile_photo,
      });

      if (user.email) {
        await prisma.user.update({
          where: { email: user.email },
          data: {
            name: user.name || undefined,
            profile_photo: user.profile_photo || undefined,
            role: "FREE",
            status: "active",
            updated_at: new Date(),
            last_login: new Date(),
          },
        });
      }
    },
    async signIn({ user }) {
      console.log("Sign in event:", {
        email: user.email,
        name: user.name,
        profile_photo: user.profile_photo,
      });

      if (user.email) {
        await prisma.user.update({
          where: { email: user.email },
          data: {
            name: user.name || undefined,
            profile_photo: user.profile_photo || undefined,
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
