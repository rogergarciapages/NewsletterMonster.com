import { NextResponse } from "next/server";

import { Prisma } from "@prisma/client";

import { getPopularTags } from "@/lib/services/tag-service";

export const dynamic = "force-dynamic";

const FALLBACK_TAGS = [
  { id: 1, name: "Technology", slug: "technology", count: 100 },
  { id: 2, name: "Business", slug: "business", count: 80 },
  { id: 3, name: "Marketing", slug: "marketing", count: 75 },
  { id: 4, name: "Design", slug: "design", count: 60 },
  { id: 5, name: "Finance", slug: "finance", count: 55 },
  { id: 6, name: "Startups", slug: "startups", count: 50 },
  { id: 7, name: "AI", slug: "ai", count: 45 },
];

export async function GET() {
  try {
    const tags = await getPopularTags();

    // If no tags are found, return fallback data
    if (!tags || tags.length === 0) {
      return NextResponse.json(FALLBACK_TAGS);
    }

    return NextResponse.json(tags);
  } catch (error) {
    console.error("Error fetching popular tags:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P5010") {
        // Return fallback data on database connection error
        return NextResponse.json(FALLBACK_TAGS);
      }
    }

    // Return fallback data on any error
    return NextResponse.json(FALLBACK_TAGS);
  }
}
