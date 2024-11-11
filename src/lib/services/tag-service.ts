import { prisma } from "@/lib/prisma-client";

export async function getPopularTags(limit = 20) {
  const tags = await prisma.tag.findMany({
    where: {
      count: {
        gt: 0,
      },
    },
    orderBy: {
      count: "desc",
    },
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
