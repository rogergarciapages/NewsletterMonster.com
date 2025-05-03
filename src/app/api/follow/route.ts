// src/app/api/follow/route.ts
import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { brandId, action } = await req.json();
    if (!brandId) {
      return NextResponse.json({ error: "Missing required brandId field" }, { status: 400 });
    }

    const userId = session.user.user_id;

    // Use a transaction to ensure atomicity
    const result = await prisma.$transaction(async tx => {
      if (action === "follow") {
        // Check if follow relationship already exists
        const existingFollow = await tx.follow.findUnique({
          where: {
            follower_id_brand_id: {
              follower_id: userId,
              brand_id: brandId,
            },
          },
        });

        // If follow relationship doesn't exist, create it and increment counter
        if (!existingFollow) {
          await tx.follow.create({
            data: {
              follower_id: userId,
              brand_id: brandId,
            },
          });

          // We'll handle follower count separately since schema might not have the field yet
        }
      } else if (action === "unfollow") {
        // Check if follow relationship exists before attempting to delete it
        const existingFollow = await tx.follow.findUnique({
          where: {
            follower_id_brand_id: {
              follower_id: userId,
              brand_id: brandId,
            },
          },
        });

        // If follow relationship exists, delete it and decrement counter
        if (existingFollow) {
          await tx.follow.delete({
            where: {
              follower_id_brand_id: {
                follower_id: userId,
                brand_id: brandId,
              },
            },
          });

          // We'll handle follower count separately since schema might not have the field yet
        }
      } else {
        throw new Error("Invalid action");
      }

      // Get updated follower count by counting relationships
      const followersCount = await tx.follow.count({
        where: {
          brand_id: brandId,
        },
      });

      return { followersCount };
    });

    return NextResponse.json({
      success: true,
      followersCount: result.followersCount,
      action,
    });
  } catch (error) {
    console.error("Error in follow API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Status endpoint
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const brandId = searchParams.get("brandId");

    if (!brandId) {
      return NextResponse.json({ error: "Missing brandId" }, { status: 400 });
    }

    // Count followers directly using relationship count
    const followersCount = await prisma.follow.count({
      where: {
        brand_id: brandId,
      },
    });

    // Check if current user is following this brand
    let isFollowing = false;
    if (session?.user?.user_id) {
      const follow = await prisma.follow.findUnique({
        where: {
          follower_id_brand_id: {
            follower_id: session.user.user_id,
            brand_id: brandId,
          },
        },
      });
      isFollowing = !!follow;
    }

    return NextResponse.json({
      isFollowing,
      followersCount,
    });
  } catch (error) {
    console.error("Error in follow status API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
