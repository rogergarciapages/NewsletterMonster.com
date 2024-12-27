import { NextResponse } from "next/server";

import { BadgeScheduler } from "@/lib/cron/badge-scheduler";
import { BadgeService } from "@/lib/services/badge";

// Start the scheduler when the module is loaded
BadgeScheduler.start();

export async function GET() {
  // Only allow manual calculation in development mode
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      {
        success: false,
        error: "Badge calculation endpoint is only available in development mode",
      },
      { status: 403 }
    );
  }

  try {
    const dailyBadges = await BadgeService.calculateAndAwardBadges("DAY");
    const weeklyBadges = await BadgeService.calculateAndAwardBadges("WEEK");
    const monthlyBadges = await BadgeService.calculateAndAwardBadges("MONTH");

    return NextResponse.json({
      success: true,
      badges: {
        day: dailyBadges,
        week: weeklyBadges,
        month: monthlyBadges,
      },
    });
  } catch (error) {
    console.error("Error calculating badges:", error);
    return NextResponse.json(
      { success: false, error: "Failed to calculate badges" },
      { status: 500 }
    );
  }
}
