/* eslint-disable check-file/folder-naming-convention */
import options from "@/config/auth";
import NextAuth from "next-auth";

const handler = NextAuth(options);

export { handler as GET, handler as POST };

