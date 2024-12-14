// src/app/api/newsletters/trending/route.ts
import { NextResponse } from "next/server";

import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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

        // Ensure connection is reset between retries
        await prisma.$disconnect();
        await prisma.$connect();
      }
    }
  }

  throw lastError;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get("skip") || "0");
    const take = parseInt(searchParams.get("take") || "15");

    const newsletters = await withRetry(async () => {
      return prisma.newsletter.findMany({
        skip,
        take,
        orderBy: [{ likes_count: "desc" }, { you_rocks_count: "desc" }, { created_at: "desc" }],
        select: {
          newsletter_id: true,
          sender: true,
          subject: true,
          html_file_url: true,
          full_screenshot_url: true,
          top_screenshot_url: true,
          likes_count: true,
          you_rocks_count: true,
          created_at: true,
          products_link: true,
          summary: true,
          tags: true,
          user_id: true,
        },
      });
    });

    if (!newsletters || newsletters.length === 0) {
      return NextResponse.json({ error: "No newsletters found" }, { status: 404 });
    }

    return NextResponse.json(newsletters);
  } catch (error) {
    console.error("Error fetching trending newsletters:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P5010") {
        return NextResponse.json(
          { error: "Database connection error. Please try again." },
          { status: 503 }
        );
      }
    }

    return NextResponse.json({ error: "Failed to fetch trending newsletters" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
