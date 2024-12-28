import { NextResponse } from "next/server";

import { BadgeService } from "@/lib/services/badge";

let isCalculating = false;

export async function GET() {
  // Only allow manual calculation in development mode
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Manual badge calculation is only allowed in development mode" },
      { status: 403 }
    );
  }

  if (isCalculating) {
    return NextResponse.json({ error: "Badge calculation already in progress" }, { status: 409 });
  }

  try {
    isCalculating = true;

    // Calculate badges sequentially
    const day = await BadgeService.calculateAndAwardBadges("DAY");
    const week = await BadgeService.calculateAndAwardBadges("WEEK");
    const month = await BadgeService.calculateAndAwardBadges("MONTH");

    return NextResponse.json({
      success: true,
      badges: { day, week, month },
    });
  } catch (error) {
    console.error("Error calculating badges:", error);
    return NextResponse.json(
      { success: false, error: "Failed to calculate badges" },
      { status: 500 }
    );
  } finally {
    isCalculating = false;
  }
}
