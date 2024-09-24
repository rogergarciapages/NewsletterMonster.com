import { DefaultUser } from "next-auth";

// Extend the User type to include custom properties
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      profile_photo?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    profile_photo?: string | null;
  }
}
