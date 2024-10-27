import authOptions from "@/config/auth";
import { prisma } from "@/lib/prisma-client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ isFollowing: false });
    }

    const { searchParams } = new URL(req.url);
    const targetId = searchParams.get("targetId");
    const isUnclaimed = searchParams.get("isUnclaimed") === "true";

    if (!targetId) {
      return NextResponse.json({ error: "Target ID required" }, { status: 400 });
    }

    // Check if follow exists
    const follow = await prisma.follow.findFirst({
      where: {
        follower_id: session.user.user_id,
        OR: [
          { following_id: isUnclaimed ? undefined : targetId },
          { following_name: isUnclaimed ? targetId : undefined }
        ]
      }
    });

    return NextResponse.json({ isFollowing: !!follow });
  } catch (error) {
    console.error("Error checking follow status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
