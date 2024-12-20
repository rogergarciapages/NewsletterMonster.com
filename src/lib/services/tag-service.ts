// src/lib/services/tag-service.ts
import prisma from "@/lib/prisma";

const MAX_RETRIES = 3;
const INITIAL_BACKOFF = 1000; // 1 second

async function withRetry<T>(operation: () => Promise<T>): Promise<T> {
  let lastError;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt + 1} failed:`, error);

      if (attempt < MAX_RETRIES - 1) {
        const backoff = INITIAL_BACKOFF * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, backoff));
      }
    }
  }

  throw lastError;
}

export async function getTagBySlug(slug: string) {
  return withRetry(async () => {
    const tag = await prisma.tag.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        count: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return tag;
  });
}

export async function getPopularTags(limit = 20) {
  return withRetry(async () => {
    const tags = await prisma.tag.findMany({
      where: {
        count: { gt: 0 },
      },
      orderBy: { count: "desc" },
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        count: true,
      },
    });
    return tags;
  });
}

export async function getNewslettersByTag(tagId: number, skip = 0, take = 15) {
  return withRetry(async () => {
    const result = await prisma.newsletter.findMany({
      where: {
        NewsletterTag: {
          some: { tag_id: tagId },
        },
      },
      orderBy: { created_at: "desc" },
      skip,
      take,
      select: {
        newsletter_id: true,
        user_id: true,
        sender: true,
        subject: true,
        top_screenshot_url: true,
        likes_count: true,
        you_rocks_count: true,
        created_at: true,
        summary: true,
      },
    });
    return result;
  });
}

export async function getTopTags(limit = 6) {
  return withRetry(async () => {
    const tags = await prisma.tag.findMany({
      where: {
        count: { gt: 0 },
      },
      orderBy: { count: "desc" },
      take: limit,
      include: {
        Newsletters: {
          take: 6,
          include: {
            Newsletter: {
              select: {
                newsletter_id: true,
                user_id: true,
                sender: true,
                subject: true,
                top_screenshot_url: true,
                likes_count: true,
                you_rocks_count: true,
                created_at: true,
                summary: true,
              },
            },
          },
          orderBy: {
            Newsletter: {
              created_at: "desc",
            },
          },
        },
      },
    });
    return tags;
  });
}
