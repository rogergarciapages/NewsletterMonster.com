import { prisma } from "@/lib/prisma-client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const targetId = searchParams.get("targetId");
    const isUnclaimed = searchParams.get("isUnclaimed") === "true";

    if (!targetId) {
      return NextResponse.json({ error: "Target ID required" }, { status: 400 });
    }

    const count = await prisma.follow.count({
      where: {
        OR: [
          { following_id: isUnclaimed ? undefined : targetId },
          { following_name: isUnclaimed ? targetId : undefined }
        ]
      }
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error getting follower count:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}