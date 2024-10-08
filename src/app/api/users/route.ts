import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user_id: {
      id: string;
      image: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    id: string;
    picture?: string;
  }
}
