import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      user_id: string;
      profile_photo?: string | null;
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    user_id: string;
    profile_photo?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user_id: string;
    picture?: string;
  }
}
