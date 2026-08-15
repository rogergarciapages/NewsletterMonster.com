import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
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

    if (!user) {
      return NextResponse.json({ count: 0 });
    }

    const count = await prisma.bookmark.count({
      where: {
        user_id: user.user_id,
      },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error fetching bookmark count:", error);
    return NextResponse.json({ count: 0 });
  }
}
