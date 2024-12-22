import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/config/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { newsletterId, incrementBy = 1 } = await req.json();
    if (!newsletterId) {
      return NextResponse.json({ error: "Newsletter ID is required" }, { status: 400 });
    }

    // Update the you_rocks_count in a transaction
    const result = await prisma.$transaction(async tx => {
      // Update the newsletter's you_rocks_count
      const updatedNewsletter = await tx.newsletter.update({
        where: { newsletter_id: newsletterId },
        data: {
          you_rocks_count: {
            increment: incrementBy,
          },
        },
        select: {
          you_rocks_count: true,
        },
      });

      return updatedNewsletter;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in you-rock route:", error);
    return NextResponse.json({ error: "Failed to update you rocks count" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const newsletterId = searchParams.get("newsletterId");

    if (!newsletterId) {
      return NextResponse.json({ error: "Newsletter ID is required" }, { status: 400 });
    }

    const newsletter = await prisma.newsletter.findUnique({
      where: { newsletter_id: parseInt(newsletterId) },
      select: { you_rocks_count: true },
    });

    if (!newsletter) {
      return NextResponse.json({ error: "Newsletter not found" }, { status: 404 });
    }

    return NextResponse.json({ you_rocks_count: newsletter.you_rocks_count ?? 0 });
  } catch (error) {
    console.error("Error in you-rock route:", error);
    return NextResponse.json({ error: "Failed to get you rocks count" }, { status: 500 });
  }
}
