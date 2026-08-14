import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  return createClient(request);
}

export const config = {
  matcher: [
    "/user",
    "/user/:path*",
    "/settings/:path*",
    "/bookmarks/:path*",
    "/following/:path*",
    "/followers/:path*",
    "/drafts/:path*",
  ],
};
