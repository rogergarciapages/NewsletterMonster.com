import { NextRequest, NextResponse } from "next/server";

import { getTopTagsWithNewsletters } from "@/lib/services/tags";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const skip = parseInt(searchParams.get("skip") || "0");
  const take = parseInt(searchParams.get("take") || "10");

  try {
    const tags = await getTopTagsWithNewsletters(skip, take);
    return NextResponse.json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 });
  }
}
