// src/types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      user_id: string;
      email: string;
      name: string;
      image?: string | null;
      profile_photo?: string | null;
      username?: string | null;
      role: string;
      emailVerified?: Date | null;
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    user_id: string;
    email: string;
    name: string;
    image?: string | null;
    profile_photo?: string | null;
    username?: string | null;
    role: string;
    emailVerified?: Date | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user_id: string;
    email: string;
    name: string;
    picture?: string | null;
    profile_photo?: string | null;
    username?: string | null;
    role: string;
    emailVerified?: Date | null;
  }
}