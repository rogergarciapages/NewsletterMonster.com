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

    // Check if already following
    const existingFollow = await prisma.follow.findFirst({
      where: {
        follower_id: session.user.user_id,
        following_name: targetId,
      }
    });

    if (existingFollow) {
      return NextResponse.json({ error: "Already following" }, { status: 400 });
    }

    // Create follow using following_name
    await prisma.follow.create({
      data: {
        follower_id: session.user.user_id,
        following_name: targetId,
      }
    });

    // Get updated count
    const count = await prisma.follow.count({
      where: {
        following_name: targetId,
      }
    });

    return NextResponse.json({ success: true, count });
  } catch (error) {
    console.error("Error following:", error);
    return NextResponse.json({ error: "Failed to follow" }, { status: 500 });
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

    // Delete follow by name
    const result = await prisma.follow.deleteMany({
      where: {
        follower_id: session.user.user_id,
        following_name: targetId,
      }
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Not following" }, { status: 404 });
    }

    // Get updated count
    const count = await prisma.follow.count({
      where: {
        following_name: targetId,
      }
    });

    return NextResponse.json({ success: true, count });
  } catch (error) {
    console.error("Error unfollowing:", error);
    return NextResponse.json({ error: "Failed to unfollow" }, { status: 500 });
  }
}