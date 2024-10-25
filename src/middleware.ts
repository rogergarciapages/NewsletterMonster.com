import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  (req) => {
    const path = req.nextUrl.pathname;
    
    // Allow public paths even if not authenticated
    if (path === "/") {
      return NextResponse.next();
    }
    
    // Protected paths logic
    if (path.startsWith("/settings") || 
        path.startsWith("/bookmarks") || 
        path.startsWith("/following") || 
        path.startsWith("/followers") || 
        path.startsWith("/drafts")) {
      return NextResponse.next();
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
);

// Configure which routes to protect
export const config = {
  matcher: [
    "/settings/:path*",
    "/bookmarks/:path*",
    "/following/:path*",
    "/followers/:path*",
    "/drafts/:path*"
  ]
};