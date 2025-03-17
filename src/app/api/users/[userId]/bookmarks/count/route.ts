import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ count: 0 });
    }

    // Get the count of bookmarks for the user
    const count = await prisma.bookmark.count({
      where: {
        user_id: params.userId,
      },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error fetching bookmark count:", error);
    return NextResponse.json({ error: "Failed to fetch bookmark count" }, { status: 500 });
  }
}
