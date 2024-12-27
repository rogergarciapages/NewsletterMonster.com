import { NextResponse } from "next/server";

import { BadgeService } from "@/lib/services/badge";

export async function GET(request: Request, { params }: { params: { newsletterId: string } }) {
  try {
    const newsletterId = parseInt(params.newsletterId);

    if (isNaN(newsletterId)) {
      return new NextResponse("Invalid newsletter ID", { status: 400 });
    }

    const badges = await BadgeService.getBadgesForNewsletter(newsletterId);
    return NextResponse.json(badges);
  } catch (error) {
    console.error("Error fetching newsletter badges:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
