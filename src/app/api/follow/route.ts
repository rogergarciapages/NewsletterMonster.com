// src/app/api/follow/route.ts
import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/config/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { brandId, action } = await req.json();
    if (!brandId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const userId = session.user.user_id;

    if (action === "follow") {
      await prisma.follow.create({
        data: {
          follower_id: userId,
          brand_id: brandId,
        },
      });
    } else if (action === "unfollow") {
      await prisma.follow.delete({
        where: {
          follower_id_brand_id: {
            follower_id: userId,
            brand_id: brandId,
          },
        },
      });
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const followersCount = await prisma.follow.count({
      where: {
        brand_id: brandId,
      },
    });

    return NextResponse.json({ success: true, followersCount });
  } catch (error) {
    console.error("Error in follow API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const brandId = searchParams.get("brandId");

    if (!brandId) {
      return NextResponse.json({ error: "Missing brandId" }, { status: 400 });
    }

    const isFollowing = await prisma.follow.findUnique({
      where: {
        follower_id_brand_id: {
          follower_id: session.user.user_id,
          brand_id: brandId,
        },
      },
    });

    const followersCount = await prisma.follow.count({
      where: {
        brand_id: brandId,
      },
    });

    return NextResponse.json({
      isFollowing: !!isFollowing,
      followersCount,
    });
  } catch (error) {
    console.error("Error in follow status API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
