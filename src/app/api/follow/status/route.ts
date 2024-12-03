import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/config/auth";
import { prisma } from "@/lib/prisma-client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetId = searchParams.get("targetId");
    const session = await getServerSession(authOptions);

    if (!targetId) {
      return NextResponse.json({ error: "Target ID is required" }, { status: 400 });
    }

    // Combine both queries into a single database call
    const [followStatus, followCount] = await Promise.all([
      session?.user
        ? prisma.follow.findFirst({
            where: {
              follower_id: session.user.user_id,
              following_name: targetId,
            },
          })
        : null,
      prisma.follow.count({
        where: {
          following_name: targetId,
        },
      }),
    ]);

    return NextResponse.json({
      isFollowing: !!followStatus,
      followersCount: followCount,
    });
  } catch (error) {
    console.error("Error checking follow status:", error);
    return NextResponse.json({ error: "Failed to check follow status" }, { status: 500 });
  }
}
