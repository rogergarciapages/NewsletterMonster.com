// src/app/api/users/[userId]/route.ts
import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import prisma from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { user_id: params.userId },
      select: {
        name: true,
        surname: true,
        username: true,
        bio: true,
        website: true,
        location: true,
        date_of_birth: true,
        profile_photo: true,
        social_links: true,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
