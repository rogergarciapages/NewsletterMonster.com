import cron from "node-cron";

import { BadgeService } from "./services/badge";

export function initCronJobs() {
  const isDev = process.env.NODE_ENV === "development";

  // Daily badges
  cron.schedule(isDev ? "*/1 * * * *" : "59 23 * * *", async () => {
    try {
      await BadgeService.calculateAndAwardBadges("DAY");
      console.log("Daily badges calculated successfully at:", new Date().toISOString());
    } catch (error) {
      console.error("Error calculating daily badges:", error);
    }
  });

  // Weekly badges
  cron.schedule(isDev ? "*/2 * * * *" : "59 23 * * 0", async () => {
    try {
      await BadgeService.calculateAndAwardBadges("WEEK");
      console.log("Weekly badges calculated successfully at:", new Date().toISOString());
    } catch (error) {
      console.error("Error calculating weekly badges:", error);
    }
  });

  // Monthly badges
  cron.schedule(isDev ? "*/3 * * * *" : "59 23 L * *", async () => {
    try {
      await BadgeService.calculateAndAwardBadges("MONTH");
      console.log("Monthly badges calculated successfully at:", new Date().toISOString());
    } catch (error) {
      console.error("Error calculating monthly badges:", error);
    }
  });

  console.log(
    "Badge calculation cron jobs initialized in",
    isDev ? "development" : "production",
    "mode"
  );
  if (isDev) {
    console.log("Development schedules:");
    console.log("- Daily badges: every minute");
    console.log("- Weekly badges: every 2 minutes");
    console.log("- Monthly badges: every 3 minutes");
  }
}
