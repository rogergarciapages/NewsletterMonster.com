import { BadgeCategory, BadgeRank, BadgeType, Prisma } from "@prisma/client";

import prisma from "@/lib/prisma";

interface TimeRange {
  start: Date;
  end: Date;
}

interface RankResult {
  newsletterId: number;
  count: number;
}

export class BadgeService {
  private static async getTimeRange(
    category: BadgeCategory,
    date: Date = new Date()
  ): Promise<TimeRange> {
    const now = new Date();
    switch (category) {
      case "DAY":
        // Previous day (24 hours)
        const oneDayAgo = new Date(now);
        oneDayAgo.setUTCHours(0, 0, 0, 0); // Start of the previous day
        return {
          start: oneDayAgo,
          end: now,
        };
      case "WEEK":
        // Previous week (7 days)
        const oneWeekAgo = new Date(now);
        oneWeekAgo.setUTCDate(now.getUTCDate() - 7);
        oneWeekAgo.setUTCHours(0, 0, 0, 0); // Start of the day 7 days ago
        return {
          start: oneWeekAgo,
          end: now,
        };
      case "MONTH":
        // Current month
        const startOfMonth = new Date(now);
        startOfMonth.setUTCDate(1); // First day of the current month
        startOfMonth.setUTCHours(0, 0, 0, 0);
        return {
          start: startOfMonth,
          end: now,
        };
      default:
        throw new Error(`Invalid badge category: ${category}`);
    }
  }

  private static async getTopNewsletters(
    type: BadgeType,
    timeRange: TimeRange,
    limit: number = 3
  ): Promise<RankResult[]> {
    const field = type === "LIKE" ? "likes_count" : "you_rocks_count";

    // Get all newsletters in time range
    const allNewsletters = await prisma.newsletter.findMany({
      where: {
        published_at: {
          gte: timeRange.start,
          lte: timeRange.end,
        },
      },
      select: {
        newsletter_id: true,
        likes_count: true,
        you_rocks_count: true,
        published_at: true,
      },
    });

    type NewsletterResult = {
      newsletter_id: number;
      likes_count?: number | null;
      you_rocks_count?: number | null;
      published_at: Date;
    };

    const newsletters = (await prisma.newsletter.findMany({
      where: {
        published_at: {
          gte: timeRange.start,
          lte: timeRange.end,
        },
        [field]: {
          gte: 1, // Minimum requirement
        },
      },
      orderBy: [
        { [field]: "desc" },
        { published_at: "asc" }, // Tiebreaker: earlier publication wins
      ],
      take: limit,
      select: {
        newsletter_id: true,
        likes_count: type === "LIKE",
        you_rocks_count: type === "YOU_ROCK",
        published_at: true,
      },
    })) as NewsletterResult[];

    return newsletters.map(n => ({
      newsletterId: n.newsletter_id,
      count: (type === "LIKE" ? n.likes_count : n.you_rocks_count) || 0,
    }));
  }

  private static getRankFromIndex(index: number): BadgeRank {
    switch (index) {
      case 0:
        return "FIRST";
      case 1:
        return "SECOND";
      case 2:
        return "THIRD";
      default:
        throw new Error("Invalid rank index");
    }
  }

  static async calculateAndAwardBadges(category: BadgeCategory, date: Date = new Date()) {
    const timeRange = await this.getTimeRange(category, date);
    const badgeTypes: BadgeType[] = ["LIKE", "YOU_ROCK"];
    const now = new Date(); // Current timestamp for earned_at

    const badges: Prisma.BadgeCreateManyInput[] = [];

    for (const type of badgeTypes) {
      const topNewsletters = await this.getTopNewsletters(type, timeRange);

      topNewsletters.forEach((result, index) => {
        badges.push({
          type,
          category,
          rank: this.getRankFromIndex(index),
          count: result.count,
          newsletter_id: result.newsletterId,
          earned_at: now,
        });
      });
    }

    if (badges.length > 0) {
      await prisma.badge.createMany({
        data: badges,
      });
    }

    return badges;
  }

  static async getBadgesForNewsletter(newsletterId: number) {
    return prisma.badge.findMany({
      where: { newsletter_id: newsletterId },
      orderBy: { earned_at: "desc" },
    });
  }

  static async getTopBadges(type: BadgeType, category: BadgeCategory, limit: number = 10) {
    return prisma.badge.findMany({
      where: { type, category },
      include: { newsletter: true },
      orderBy: { earned_at: "desc" },
      take: limit,
    });
  }
}
