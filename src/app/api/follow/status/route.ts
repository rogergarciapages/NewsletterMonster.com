// src/app/api/follow/status/route.ts
import { NextResponse } from "next/server";

import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";

import { authOptions } from "@/config/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetId = searchParams.get("targetId");
    const session = await getServerSession(authOptions);

    if (!targetId) {
      return NextResponse.json({ error: "Target ID is required" }, { status: 400 });
    }

    // Sequential queries with basic error handling
    let followStatus = null;
    let followCount = 0;

    try {
      if (session?.user) {
        followStatus = await prisma.follow.findFirst({
          where: {
            follower_id: session.user.user_id,
            following_name: targetId,
          },
          select: { id: true },
        });
      }

      followCount = await prisma.follow.count({
        where: {
          following_name: targetId,
        },
      });
    } catch (queryError) {
      console.error("Database query error:", queryError);
      return NextResponse.json(
        { error: "Database query failed. Please try again." },
        { status: 503 }
      );
    }

    return NextResponse.json({
      isFollowing: !!followStatus,
      followersCount: followCount,
    });
  } catch (error) {
    console.error("Error checking follow status:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P5010") {
        return NextResponse.json(
          { error: "Database connection error. Please try again." },
          { status: 503 }
        );
      }
    }

    return NextResponse.json({ error: "Failed to check follow status" }, { status: 500 });
  }
}
