import { NextResponse } from "next/server";

import { BadgeCategory, BadgeType } from "@prisma/client";

import { BadgeService } from "@/lib/services/badge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") as BadgeType;
    const category = searchParams.get("category") as BadgeCategory;

    if (!type || !category) {
      return new NextResponse("Missing type or category", { status: 400 });
    }

    if (!Object.values(BadgeType).includes(type)) {
      return new NextResponse("Invalid type", { status: 400 });
    }

    if (!Object.values(BadgeCategory).includes(category)) {
      return new NextResponse("Invalid category", { status: 400 });
    }

    const badges = await BadgeService.getTopBadges(type, category);
    return NextResponse.json(badges);
  } catch (error) {
    console.error("Error fetching badges:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
