// src/app/api/newsletters/trending/route.ts
import { NextResponse } from "next/server";

import { Prisma } from "@prisma/client";

import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get("skip") || "0");
    const take = parseInt(searchParams.get("take") || "15");

    console.log("Attempting to fetch newsletters with params:", { skip, take });

    const newsletters = await prisma.newsletter.findMany({
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
        user_id: true,
      },
    });

    console.log("Newsletters fetched successfully:", newsletters.length);

    if (!newsletters || newsletters.length === 0) {
      console.log("No newsletters found");
      return NextResponse.json({ message: "No newsletters found" }, { status: 404 });
    }

    return NextResponse.json(newsletters);
  } catch (error) {
    console.error("Detailed error:", {
      name: (error as Error)?.name,
      message: (error as Error)?.message,
      stack: (error as Error)?.stack,
      code: error instanceof Prisma.PrismaClientKnownRequestError ? error.code : "unknown",
    });

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: "Database error", details: error.message },
        { status: 503 }
      );
    }

    if (error instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json(
        { error: "Database initialization error", details: error.message },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
