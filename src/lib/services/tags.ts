import prisma from "@/lib/prisma";
import type { Newsletter, Tag } from "@/types/newsletter";

export async function getTagBySlug(slug: string): Promise<Tag | null> {
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

export async function getPopularTags(limit = 10): Promise<Tag[]> {
  const tags = await prisma.tag.findMany({
    orderBy: { count: "desc" },
    take: limit,
    select: {
      id: true,
      name: true,
      slug: true,
      count: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return tags;
}

export async function getNewslettersByTag(
  tagId: number,
  skip = 0,
  take = 15
): Promise<Newsletter[]> {
  const result = await prisma.newsletter.findMany({
    where: {
      NewsletterTag: {
        some: {
          tag_id: tagId,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
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

export async function getTopTagsWithNewsletters(skip = 0, take = 10) {
  const tags = await prisma.tag.findMany({
    skip,
    take,
    orderBy: {
      count: "desc",
    },
    include: {
      NewsletterTag: {
        take: 6,
        include: {
          Newsletter: true,
        },
        orderBy: {
          Newsletter: {
            created_at: "desc",
          },
        },
      },
    },
  });

  return tags.map(tag => ({
    ...tag,
    Newsletters: tag.NewsletterTag.map(nt => ({ Newsletter: nt.Newsletter })),
  }));
}
