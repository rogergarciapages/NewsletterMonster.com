// src/config/auth.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import type { User } from "next-auth";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import LinkedInProvider from "next-auth/providers/linkedin";

import { prisma } from "@/lib/prisma-client";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req): Promise<User | null> {
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
          domain_verified: user.domain_verified,
          status: user.status,
        } as User;
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      profile(profile: any): User {
        return {
          id: profile.id.toString(),
          user_id: profile.id.toString(),
          email: profile.email!,
          name: profile.name ?? profile.login ?? profile.email?.split("@")[0] ?? "User",
          profile_photo: profile.avatar_url ?? null,
          username: profile.login,
          role: "FREE",
          emailVerified: null,
          domain_verified: false,
          status: "active",
        } as User;
      },
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "r_liteprofile r_emailaddress",
          response_type: "code",
        },
      },
      token: {
        url: "https://www.linkedin.com/oauth/v2/accessToken",
        async request(context) {
          const tokens = await context.client.grant({
            grant_type: "authorization_code",
            code: context.params.code,
            redirect_uri: context.provider.callbackUrl,
          });
          return { tokens };
        },
      },
      userinfo: {
        url: "https://api.linkedin.com/v2/me",
        params: {
          projection: "(id,localizedFirstName,localizedLastName,emailAddress,profilePicture)",
        },
      },
      profile(profile: any): User {
        return {
          id: profile.id,
          user_id: profile.id,
          email: profile.emailAddress,
          name: `${profile.localizedFirstName} ${profile.localizedLastName}`,
          profile_photo:
            profile.profilePicture?.["displayImage~"]?.elements?.[0]?.identifiers?.[0]
              ?.identifier ?? null,
          username: null,
          role: "FREE",
          emailVerified: null,
          domain_verified: false,
          status: "active",
        } as User;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "github" || account?.provider === "linkedin") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (existingUser) {
          // Link the account if user exists
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
          return true;
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
          user_id: token.user_id,
          email: token.email,
          name: token.name,
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
            profile_photo: user.profile_photo || null,
            role: "FREE",
            status: "active",
            domain_verified: false,
            updated_at: new Date(),
            last_login: new Date(),
          },
        });
      }
    },
    async signIn({ user, account }) {
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
