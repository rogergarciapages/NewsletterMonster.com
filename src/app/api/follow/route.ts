import authOptions from "@/config/auth";
import { prisma } from "@/lib/prisma-client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetId, isUnclaimed } = await req.json();

    // Check if already following
    const existingFollow = await prisma.follow.findFirst({
      where: {
        follower_id: session.user.user_id,
        OR: [
          { following_id: isUnclaimed ? undefined : targetId },
          { following_name: isUnclaimed ? targetId : undefined }
        ]
      },
    });

    if (existingFollow) {
      return NextResponse.json({ error: "Already following" }, { status: 400 });
    }

    // Create follow relationship
    const follow = await prisma.follow.create({
      data: {
        follower_id: session.user.user_id,
        ...(isUnclaimed 
          ? { following_name: targetId }
          : { following_id: targetId }
        )
      },
    });

    return NextResponse.json({ success: true, follow });
  } catch (error) {
    console.error("Error following:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const targetId = searchParams.get("targetId");
    const isUnclaimed = searchParams.get("isUnclaimed") === "true";

    if (!targetId) {
      return NextResponse.json({ error: "Target ID required" }, { status: 400 });
    }

    // Delete follow relationship
    await prisma.follow.deleteMany({
      where: {
        follower_id: session.user.user_id,
        OR: [
          { following_id: isUnclaimed ? undefined : targetId },
          { following_name: isUnclaimed ? targetId : undefined }
        ]
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error unfollowing:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}