// src/app/api/newsletters/popular/route.ts
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

export async function GET() {
  try {
    const popularNewsletters = await executeWithRetry(async () => {
      return prisma.newsletter.findMany({
        where: {
          OR: [{ likes_count: { gt: 0 } }, { you_rocks_count: { gt: 0 } }],
        },
        orderBy: [{ likes_count: "desc" }, { you_rocks_count: "desc" }, { created_at: "desc" }],
        take: 12,
        select: {
          newsletter_id: true,
          subject: true,
          top_screenshot_url: true,
          you_rocks_count: true,
          likes_count: true,
          sender: true,
          created_at: true,
          summary: true,
          user_id: true,
          html_file_url: true,
          full_screenshot_url: true,
        },
      });
    });

    return NextResponse.json(popularNewsletters);
  } catch (error) {
    console.error("Error fetching popular newsletters:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P5010") {
        return NextResponse.json(
          { error: "Database connection error. Please try again." },
          { status: 503 }
        );
      }
    }

    return NextResponse.json({ error: "Failed to fetch popular newsletters" }, { status: 500 });
  }
}
