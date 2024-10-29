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

    const { targetId } = await req.json();
    
    if (!targetId) {
      return NextResponse.json({ error: "Target ID required" }, { status: 400 });
    }

    // Check if follow already exists
    const existingFollow = await prisma.follow.findFirst({
      where: {
        follower_id: session.user.user_id,
        following_id: targetId
      }
    });

    if (existingFollow) {
      return NextResponse.json({ error: "Already following" }, { status: 400 });
    }

    // Create follow
    const follow = await prisma.follow.create({
      data: {
        follower_id: session.user.user_id,
        following_id: targetId
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

    const { targetId } = await req.json();

    if (!targetId) {
      return NextResponse.json({ error: "Target ID required" }, { status: 400 });
    }

    // Delete the follow relationship
    const result = await prisma.follow.deleteMany({
      where: {
        follower_id: session.user.user_id,
        following_id: targetId
      }
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Follow not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error unfollowing:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ isFollowing: false });
    }

    const { searchParams } = new URL(req.url);
    const targetId = searchParams.get("targetId");

    if (!targetId) {
      return NextResponse.json({ error: "Target ID required" }, { status: 400 });
    }

    const follow = await prisma.follow.findFirst({
      where: {
        follower_id: session.user.user_id,
        following_id: targetId
      }
    });

    return NextResponse.json({ isFollowing: !!follow });
  } catch (error) {
    console.error("Error checking follow status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}