import cron from "node-cron";

import { BadgeService } from "../services/badge";

let isCalculating = false;

async function calculateBadgesSafely(category: "DAY" | "WEEK" | "MONTH") {
  if (isCalculating) {
    console.log(`Skipping ${category} badge calculation - another calculation is in progress`);
    return;
  }

  try {
    isCalculating = true;
    await BadgeService.calculateAndAwardBadges(category);
  } catch (error) {
    console.error(`Error calculating ${category} badges:`, error);
  } finally {
    isCalculating = false;
  }
}

export function initBadgeScheduler() {
  console.log("Initializing badge calculation schedules:");
  console.log("- Daily badges: every day at 00:00 GMT");
  console.log("- Weekly badges: every Thursday at 00:00 GMT");
  console.log("- Monthly badges: last day of month at 00:00 GMT");

  // Daily at 00:00 GMT
  cron.schedule("0 0 * * *", () => calculateBadgesSafely("DAY"));

  // Weekly on Thursday at 00:00 GMT
  cron.schedule("0 0 * * 4", () => calculateBadgesSafely("WEEK"));

  // Monthly on the last day at 00:00 GMT
  cron.schedule("0 0 L * *", () => calculateBadgesSafely("MONTH"));
}
