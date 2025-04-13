import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First try to find user by username
    let user = await prisma.user.findUnique({
      where: { username: params.userId },
    });

    // If not found by username, try by user_id
    if (!user) {
      user = await prisma.user.findUnique({
        where: { user_id: params.userId },
      });
    }

    // If user not found, return error
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Security check: Users can only view their own bookmark count
    if (user.user_id !== session.user.user_id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Get the count of bookmarks for the user using the actual user_id
    const count = await prisma.bookmark.count({
      where: {
        user_id: user.user_id,
      },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error fetching bookmark count:", error);
    return NextResponse.json({ error: "Failed to fetch bookmark count" }, { status: 500 });
  }
}
