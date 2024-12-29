import { BadgeService } from "@/lib/services/badge";

export async function POST() {
  try {
    // Manual trigger for badge calculation (development only)
    if (process.env.NODE_ENV === "development") {
      await BadgeService.calculateAndAwardBadges("DAY");
      await BadgeService.calculateAndAwardBadges("WEEK");
      await BadgeService.calculateAndAwardBadges("MONTH");
      return new Response(
        JSON.stringify({
          success: true,
          message: "Badge calculations completed",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        message: "Badge calculations are only available in development mode",
      }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error calculating badges",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
