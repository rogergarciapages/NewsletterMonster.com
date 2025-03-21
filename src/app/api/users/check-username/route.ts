import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { available: false, error: "Username parameter is required" },
        { status: 400 }
      );
    }

    // Get the current user session
    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.user_id;

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
      select: { user_id: true },
    });

    // Username is available if:
    // 1. It doesn't exist, or
    // 2. It belongs to the current user (they're editing their profile but keeping same username)
    const isAvailable = !existingUser || (currentUserId && existingUser.user_id === currentUserId);

    return NextResponse.json({ available: isAvailable });
  } catch (error) {
    console.error("Error checking username availability:", error);
    return NextResponse.json(
      { available: false, error: "Failed to check username availability" },
      { status: 500 }
    );
  }
}
