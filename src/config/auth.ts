import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { env } from "process";

const options: NextAuthOptions = {

providers: [
  GoogleProvider({
    clientId: env.GOOGLE_CLIENT_ID as string,
    clientSecret: env.GOOGLE_CLIENT_SECRET as string, 
  }),
],
};

export default options;