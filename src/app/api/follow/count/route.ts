// src/app/api/follow/count/route.ts
import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/config/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { brandId, action } = await request.json();

    if (!brandId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get the current follow count
    const followCount = await prisma.follow.count({
      where: {
        brand_id: brandId,
      },
    });

    return NextResponse.json({
      count: followCount,
    });
  } catch (error) {
    console.error("Error in follow count route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
