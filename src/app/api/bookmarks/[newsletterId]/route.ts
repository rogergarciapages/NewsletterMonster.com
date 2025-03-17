import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { createBookmark, deleteBookmark, isNewsletterBookmarked } from "@/lib/services/bookmark";

export async function GET(request: NextRequest, { params }: { params: { newsletterId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const newsletterId = parseInt(params.newsletterId);

  try {
    const isBookmarked = await isNewsletterBookmarked(session.user.user_id, newsletterId);
    return NextResponse.json({ isBookmarked });
  } catch (error) {
    console.error("Error checking bookmark status:", error);
    return NextResponse.json({ error: "Failed to check bookmark status" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { newsletterId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const newsletterId = parseInt(params.newsletterId);

  try {
    await createBookmark(session.user.user_id, newsletterId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating bookmark:", error);
    return NextResponse.json({ error: "Failed to create bookmark" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { newsletterId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const newsletterId = parseInt(params.newsletterId);

  try {
    await deleteBookmark(session.user.user_id, newsletterId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    return NextResponse.json({ error: "Failed to delete bookmark" }, { status: 500 });
  }
}
