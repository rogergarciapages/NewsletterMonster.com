// src/app/api/follow/route.ts
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
    
    if (!targetId) {
      return NextResponse.json({ error: "Target ID required" }, { status: 400 });
    }

    // Check if follow already exists
    const existingFollow = await prisma.follow.findFirst({
      where: {
        follower_id: session.user.user_id,
        OR: [
          { following_id: isUnclaimed ? undefined : targetId },
          { following_name: isUnclaimed ? targetId : undefined }
        ]
      }
    });

    if (existingFollow) {
      return NextResponse.json({ error: "Already following" }, { status: 400 });
    }

    // Create follow
    const follow = await prisma.follow.create({
      data: {
        follower_id: session.user.user_id,
        ...(isUnclaimed
          ? { following_name: targetId }
          : { following_id: targetId })
      }
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

    // Changed to get data from request body
    const data = await req.json();
    const { targetId, isUnclaimed } = data;

    if (!targetId) {
      return NextResponse.json({ error: "Target ID required" }, { status: 400 });
    }

    console.log('Attempting to unfollow:', { 
      follower_id: session.user.user_id, 
      targetId, 
      isUnclaimed 
    });

    // Delete the follow relationship
    const result = await prisma.follow.deleteMany({
      where: {
        follower_id: session.user.user_id,
        OR: [
          { following_id: isUnclaimed ? undefined : targetId },
          { following_name: isUnclaimed ? targetId : undefined }
        ]
      }
    });

    console.log('Unfollow result:', result);

    if (result.count === 0) {
      return NextResponse.json({ error: "Follow not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error unfollowing:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}