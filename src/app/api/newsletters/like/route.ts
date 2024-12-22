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

    const { newsletterId } = await req.json();
    if (!newsletterId) {
      return NextResponse.json({ error: "Newsletter ID is required" }, { status: 400 });
    }

    // Check if user has already liked this newsletter
    const existingLike = await prisma.like.findFirst({
      where: {
        user_id: session.user.user_id,
        newsletter_id: newsletterId,
      },
    });

    if (existingLike) {
      // Unlike: Remove the like and decrement count
      await prisma.$transaction([
        prisma.like.delete({
          where: {
            like_id: existingLike.like_id,
          },
        }),
        prisma.newsletter.update({
          where: { newsletter_id: newsletterId },
          data: {
            likes_count: {
              decrement: 1,
            },
          },
        }),
      ]);

      return NextResponse.json({ liked: false });
    } else {
      // Like: Create new like and increment count
      await prisma.$transaction([
        prisma.like.create({
          data: {
            user_id: session.user.user_id,
            newsletter_id: newsletterId,
          },
        }),
        prisma.newsletter.update({
          where: { newsletter_id: newsletterId },
          data: {
            likes_count: {
              increment: 1,
            },
          },
        }),
      ]);

      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error("Error handling like:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Get like status for a newsletter
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const newsletterId = searchParams.get("newsletterId");

    if (!newsletterId) {
      return NextResponse.json({ error: "Newsletter ID is required" }, { status: 400 });
    }

    const [likesCount, userLike] = await Promise.all([
      prisma.like.count({
        where: { newsletter_id: parseInt(newsletterId) },
      }),
      session?.user?.user_id
        ? prisma.like.findFirst({
            where: {
              newsletter_id: parseInt(newsletterId),
              user_id: session.user.user_id,
            },
          })
        : null,
    ]);

    return NextResponse.json({
      likesCount,
      isLiked: !!userLike,
    });
  } catch (error) {
    console.error("Error getting like status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
