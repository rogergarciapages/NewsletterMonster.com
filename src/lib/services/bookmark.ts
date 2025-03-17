import prisma from "@/lib/prisma";
import { Newsletter } from "@/types/newsletter";

export async function getBookmarksByUserId(userId: string, skip = 0, take = 20) {
  const bookmarks = await prisma.bookmark.findMany({
    where: {
      user_id: userId,
    },
    orderBy: {
      created_at: "desc",
    },
    skip,
    take,
    include: {
      User: {
        select: {
          name: true,
          username: true,
          profile_photo: true,
        },
      },
    },
  });

  // Get the newsletter details for each bookmark
  const newsletterIds = bookmarks.map(bookmark => parseInt(bookmark.bookmarked_item_id));

  const newsletters = await prisma.newsletter.findMany({
    where: {
      newsletter_id: {
        in: newsletterIds,
      },
    },
    include: {
      Brand: {
        select: {
          name: true,
          slug: true,
          logo: true,
        },
      },
    },
  });

  // Map newsletters to bookmarks
  return bookmarks.map(bookmark => {
    const newsletter = newsletters.find(
      n => n.newsletter_id.toString() === bookmark.bookmarked_item_id
    );
    return {
      ...bookmark,
      newsletter,
    };
  });
}

export async function isNewsletterBookmarked(userId: string, newsletterId: number) {
  // Convert newsletterId to a valid UUID format
  const bookmarkedItemId = convertToUuid(newsletterId);

  const bookmark = await prisma.bookmark.findFirst({
    where: {
      user_id: userId,
      bookmarked_item_id: bookmarkedItemId,
    },
  });

  return !!bookmark;
}

export async function createBookmark(userId: string, newsletterId: number) {
  // Convert newsletterId to a valid UUID format
  const bookmarkedItemId = convertToUuid(newsletterId);

  return prisma.bookmark.create({
    data: {
      user_id: userId,
      bookmarked_item_id: bookmarkedItemId,
    },
  });
}

export async function deleteBookmark(userId: string, newsletterId: number) {
  // Convert newsletterId to a valid UUID format
  const bookmarkedItemId = convertToUuid(newsletterId);

  return prisma.bookmark.deleteMany({
    where: {
      user_id: userId,
      bookmarked_item_id: bookmarkedItemId,
    },
  });
}

export async function getBookmarkedNewsletters(
  userId: string,
  skip = 0,
  take = 20
): Promise<Newsletter[]> {
  const bookmarks = await prisma.bookmark.findMany({
    where: {
      user_id: userId,
    },
    orderBy: {
      created_at: "desc",
    },
    skip,
    take,
  });

  // Extract newsletter IDs from the UUIDs
  const newsletterIds = bookmarks.map(bookmark => extractIdFromUuid(bookmark.bookmarked_item_id));

  const newsletters = await prisma.newsletter.findMany({
    where: {
      newsletter_id: {
        in: newsletterIds,
      },
    },
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
      brand_id: true,
      Brand: {
        select: {
          name: true,
          slug: true,
          logo: true,
        },
      },
    },
  });

  return newsletters as Newsletter[];
}

// Helper function to convert a number to a valid UUID format
function convertToUuid(id: number): string {
  // Create a UUID v4 format with the ID padded to 32 characters
  const idStr = id.toString().padStart(8, "0");
  return `${idStr}-0000-0000-0000-000000000000`;
}

// Helper function to extract the original ID from a UUID
function extractIdFromUuid(uuid: string): number {
  // Extract the first part of the UUID and convert it back to a number
  const idStr = uuid.split("-")[0];
  return parseInt(idStr);
}
