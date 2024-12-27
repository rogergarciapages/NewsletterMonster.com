import cron from "node-cron";

import { BadgeService } from "../services/badge";

export class BadgeScheduler {
  private static isRunning = false;

  static start() {
    if (this.isRunning) {
      return;
    }

    // Daily badges - Every day at 00:00 GMT
    cron.schedule(
      "0 0 * * *",
      async () => {
        try {
          await BadgeService.calculateAndAwardBadges("DAY");
        } catch (error) {
          console.error("Error calculating daily badges:", error);
        }
      },
      {
        timezone: "GMT",
      }
    );

    // Weekly badges - Every Thursday at 00:00 GMT
    cron.schedule(
      "0 0 * * 4",
      async () => {
        try {
          await BadgeService.calculateAndAwardBadges("WEEK");
        } catch (error) {
          console.error("Error calculating weekly badges:", error);
        }
      },
      {
        timezone: "GMT",
      }
    );

    // Monthly badges - At 00:00 GMT on the last day of each month
    cron.schedule(
      "0 0 28-31 * *",
      async () => {
        try {
          // Check if it's the last day of the month
          const now = new Date();
          const tomorrow = new Date(now);
          tomorrow.setDate(tomorrow.getDate() + 1);

          if (tomorrow.getMonth() !== now.getMonth()) {
            // It's the last day of the month
            await BadgeService.calculateAndAwardBadges("MONTH");
          }
        } catch (error) {
          console.error("Error calculating monthly badges:", error);
        }
      },
      {
        timezone: "GMT",
      }
    );

    this.isRunning = true;
  }

  static stop() {
    this.isRunning = false;
  }
}
