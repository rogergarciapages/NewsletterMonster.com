// src/lib/services/tag-service.ts
import { prisma } from "../prisma-client";

export async function getTagBySlug(slug: string) {
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
}

export async function getPopularTags(limit = 20) {
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
}

export async function getNewslettersByTag(tagId: number, skip = 0, take = 15) {
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
}

export async function getTopTags(limit = 6) {
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
}
