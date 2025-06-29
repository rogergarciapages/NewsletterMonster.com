import { NextRequest, NextResponse } from "next/server";

import { getTagBySlug } from "@/lib/services/tags";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Slug parameter is required" }, { status: 400 });
    }

    const tag = await getTagBySlug(slug);

    if (!tag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    return NextResponse.json(tag);
  } catch (error) {
    console.error("Error fetching tag by slug:", error);
    return NextResponse.json({ error: "Failed to fetch tag" }, { status: 500 });
  }
}
