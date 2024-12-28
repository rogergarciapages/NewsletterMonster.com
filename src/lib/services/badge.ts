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
    const referenceDate = new Date(date);

    switch (category) {
      case "DAY": {
        // For daily badges: previous day from 00:00 to 23:59:59
        const start = new Date(referenceDate);
        start.setUTCDate(start.getUTCDate() - 1);
        start.setUTCHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setUTCHours(23, 59, 59, 999);

        return { start, end };
      }
      case "WEEK": {
        // For weekly badges: previous week from Monday 00:00 to Sunday 23:59:59
        const start = new Date(referenceDate);
        start.setUTCDate(start.getUTCDate() - 7);
        start.setUTCHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setUTCDate(end.getUTCDate() + 6);
        end.setUTCHours(23, 59, 59, 999);

        return { start, end };
      }
      case "MONTH": {
        // For monthly badges: current month from 1st 00:00 to last day 23:59:59
        const start = new Date(referenceDate.getUTCFullYear(), referenceDate.getUTCMonth(), 1);
        start.setUTCHours(0, 0, 0, 0);

        const end = new Date(referenceDate.getUTCFullYear(), referenceDate.getUTCMonth() + 1, 0);
        end.setUTCHours(23, 59, 59, 999);

        return { start, end };
      }
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

    console.log(`Calculating badges for ${category}:`, {
      start: timeRange.start.toISOString(),
      end: timeRange.end.toISOString(),
      currentDate: date.toISOString(),
    });

    const badges: Prisma.BadgeCreateManyInput[] = [];

    for (const type of badgeTypes) {
      // First, check if badges for this time period already exist
      const existingBadgesForPeriod = await prisma.badge.findMany({
        where: {
          type,
          category,
          earned_at: {
            gte: timeRange.start,
            lte: timeRange.end,
          },
        },
      });

      // If badges already exist for this period, skip
      if (existingBadgesForPeriod.length > 0) {
        console.log(`Badges already awarded for ${type} ${category} in this time period`);
        continue;
      }

      const topNewsletters = await this.getTopNewsletters(type, timeRange);
      console.log(`Found ${topNewsletters.length} top newsletters for ${type} ${category}`);

      for (let index = 0; index < topNewsletters.length; index++) {
        const result = topNewsletters[index];
        const rank = this.getRankFromIndex(index);

        badges.push({
          type,
          category,
          rank,
          count: result.count,
          newsletter_id: result.newsletterId,
          earned_at: date, // Use the provided date
        });
        console.log(
          `New badge to be awarded: ${type} ${category} ${rank} to newsletter ${result.newsletterId} with count ${result.count}`
        );
      }
    }

    if (badges.length > 0) {
      // Use transaction to ensure atomicity
      await prisma.$transaction(async tx => {
        // Final check before creating badges
        for (const badge of badges) {
          const existingForPeriod = await tx.badge.findFirst({
            where: {
              category: badge.category,
              earned_at: {
                gte: timeRange.start,
                lte: timeRange.end,
              },
            },
          });

          if (!existingForPeriod) {
            await tx.badge.create({
              data: badge,
            });
            console.log(
              `Badge awarded: ${badge.type} ${badge.category} ${badge.rank} to newsletter ${badge.newsletter_id}`
            );
          }
        }
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
