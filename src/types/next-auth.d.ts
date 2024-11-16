// src/types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      user_id: string;
      email: string;
      name: string;
      profile_photo?: string | null;
      username?: string | null;
      role: string;
      emailVerified?: Date | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    user_id: string;
    email: string;
    name: string;
    profile_photo?: string | null;
    username?: string | null;
    role: string;
    emailVerified?: Date | null;
    domain_verified: boolean;
    status: string;
  }

  interface Account {
    provider: string;
    type: string;
    providerAccountId: string;
    access_token?: string;
    token_type?: string;
    scope?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user_id: string;
    email: string;
    name: string;
    profile_photo?: string | null;
    username?: string | null;
    role: string;
    emailVerified?: Date | null;
    accessToken?: string;
  }
}
