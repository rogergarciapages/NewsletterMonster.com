// src/app/api/follow/check/route.ts
import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import authOptions from "@/config/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const targetId = searchParams.get("targetId");

    if (!targetId) {
      return NextResponse.json({ error: "Target ID required" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ isFollowing: false });
    }

    // Check if follow exists by either ID or name
    const follow = await prisma.follow.findFirst({
      where: {
        follower_id: session.user.user_id,
        brand_id: targetId,
      },
    });

    return NextResponse.json({ isFollowing: !!follow });
  } catch (error) {
    console.error("Error checking follow status:", error);
    return NextResponse.json({ isFollowing: false });
  }
}
