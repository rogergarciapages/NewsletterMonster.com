import prisma from "@/lib/prisma";

/**
 * Check if a newsletter is liked by a specific user
 * @param userId The ID of the user
 * @param newsletterId The ID of the newsletter
 * @returns A boolean indicating if the newsletter is liked by the user
 */
export async function isNewsletterLiked(userId: string, newsletterId: number): Promise<boolean> {
  const like = await prisma.like.findFirst({
    where: {
      user_id: userId,
      newsletter_id: newsletterId,
    },
  });

  return !!like;
}

/**
 * Add a like to a newsletter
 * @param userId The ID of the user
 * @param newsletterId The ID of the newsletter
 * @returns The created like
 */
export async function likeNewsletter(userId: string, newsletterId: number) {
  // Check if the like already exists
  const existingLike = await prisma.like.findFirst({
    where: {
      user_id: userId,
      newsletter_id: newsletterId,
    },
  });

  if (existingLike) {
    return existingLike;
  }

  // Create a new like
  const like = await prisma.like.create({
    data: {
      user_id: userId,
      newsletter_id: newsletterId,
    },
  });

  // Increment the likes_count of the newsletter
  await prisma.newsletter.update({
    where: { newsletter_id: newsletterId },
    data: {
      likes_count: {
        increment: 1,
      },
    },
  });

  return like;
}

/**
 * Remove a like from a newsletter
 * @param userId The ID of the user
 * @param newsletterId The ID of the newsletter
 * @returns Boolean indicating if the like was successfully removed
 */
export async function unlikeNewsletter(userId: string, newsletterId: number): Promise<boolean> {
  // Check if the like exists
  const existingLike = await prisma.like.findFirst({
    where: {
      user_id: userId,
      newsletter_id: newsletterId,
    },
  });

  if (!existingLike) {
    return false;
  }

  // Delete the like
  await prisma.like.delete({
    where: {
      like_id: existingLike.like_id,
    },
  });

  // Decrement the likes_count of the newsletter
  await prisma.newsletter.update({
    where: { newsletter_id: newsletterId },
    data: {
      likes_count: {
        decrement: 1,
      },
    },
  });

  return true;
}

/**
 * Get the likes count for a newsletter
 * @param newsletterId The ID of the newsletter
 * @returns The number of likes
 */
export async function getNewsletterLikesCount(newsletterId: number): Promise<number> {
  const count = await prisma.like.count({
    where: {
      newsletter_id: newsletterId,
    },
  });

  return count;
}

/**
 * Get the top liked newsletters
 * @param limit The maximum number of newsletters to return
 * @returns An array of newsletters ordered by likes count
 */
export async function getTopLikedNewsletters(limit = 10) {
  const newsletters = await prisma.newsletter.findMany({
    take: limit,
    orderBy: {
      likes_count: "desc",
    },
    select: {
      newsletter_id: true,
      subject: true,
      sender: true,
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

  return newsletters;
}
