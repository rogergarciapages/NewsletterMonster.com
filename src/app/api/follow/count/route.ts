// src/app/api/follow/count/route.ts
import { prisma } from "@/lib/prisma-client";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const targetId = searchParams.get("targetId");

    if (!targetId) {
      return NextResponse.json({ error: "Target ID required" }, { status: 400 });
    }

    // Count followers by name
    const count = await prisma.follow.count({
      where: {
        following_name: targetId, // Use following_name for brand names
      }
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error getting follow count:", error);
    return NextResponse.json({ count: 0 });
  }
}