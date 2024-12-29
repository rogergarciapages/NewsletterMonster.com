import { BadgeService } from "../services/badge";

let isCalculating = false;

export async function calculateBadgesSafely(category: "DAY" | "WEEK" | "MONTH") {
  if (isCalculating) {
    console.log(`Skipping ${category} badge calculation - another calculation is in progress`);
    return;
  }

  try {
    isCalculating = true;
    console.log(`Starting ${category} badge calculation at ${new Date().toISOString()}`);
    await BadgeService.calculateAndAwardBadges(category);
    console.log(`Completed ${category} badge calculation at ${new Date().toISOString()}`);
  } catch (error) {
    console.error(`Error calculating ${category} badges:`, error);
  } finally {
    isCalculating = false;
  }
}
