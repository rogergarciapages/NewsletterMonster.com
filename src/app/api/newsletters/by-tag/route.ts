import { NextResponse } from "next/server";

import { Prisma } from "@prisma/client";

import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function executeWithRetry<T>(operation: () => Promise<T>, retries = 3): Promise<T> {
  let lastError: Error | unknown;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await prisma.$connect();
      return await operation();
    } catch (error: unknown) {
      lastError = error;
      console.error(`Attempt ${attempt} failed:`, error);

      if (attempt === retries) break;

      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
      await wait(delay);

      await prisma.$disconnect();
    }
  }

  throw lastError;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tagId = searchParams.get("tagId");
    const skip = parseInt(searchParams.get("skip") || "0");
    const take = parseInt(searchParams.get("take") || "15");

    if (!tagId) {
      return NextResponse.json({ error: "Tag ID is required" }, { status: 400 });
    }

    const newsletters = await executeWithRetry(async () => {
      return prisma.newsletter.findMany({
        where: {
          NewsletterTag: {
            some: {
              tag_id: parseInt(tagId),
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
          sender: true,
          subject: true,
          top_screenshot_url: true,
          likes_count: true,
          you_rocks_count: true,
          created_at: true,
          summary: true,
          NewsletterTag: {
            select: {
              Tag: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      });
    });

    return NextResponse.json(newsletters);
  } catch (error) {
    console.error("Error fetching newsletters by tag:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P5010") {
        return NextResponse.json(
          { error: "Database connection error. Please try again." },
          { status: 503 }
        );
      }
    }

    return NextResponse.json({ error: "Failed to fetch newsletters" }, { status: 500 });
  }
}
