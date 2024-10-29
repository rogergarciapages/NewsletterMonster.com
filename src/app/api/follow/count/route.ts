// src/app/api/follow/count/route.ts
import { prisma } from "@/lib/prisma-client";
import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const targetId = searchParams.get("targetId");

    if (!targetId) {
      return NextResponse.json({ error: "Target ID required" }, { status: 400 });
    }

    // Cache follower count for 1 minute
    const getFollowerCount = unstable_cache(
      async () => {
        const count = await prisma.follow.count({
          where: {
            following_id: targetId
          }
        });
        return count;
      },
      [`follower-count-${targetId}`],
      { revalidate: 60 } // Cache for 1 minute
    );

    const count = await getFollowerCount();
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error fetching follower count:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}