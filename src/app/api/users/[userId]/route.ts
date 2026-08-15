// src/app/api/users/[userId]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  try {
    // First try to find user by user_id
    let user = await prisma.user.findUnique({
      where: { user_id: params.userId },
      select: {
        user_id: true,
        name: true,
        surname: true,
        username: true,
        bio: true,
        website: true,
        location: true,
        date_of_birth: true,
        profile_photo: true,
        SocialLinks: true,
      },
    });

    // If not found by user_id, try by username
    if (!user) {
      user = await prisma.user.findUnique({
        where: { username: params.userId },
        select: {
          user_id: true,
          name: true,
          surname: true,
          username: true,
          bio: true,
          website: true,
          location: true,
          date_of_birth: true,
          profile_photo: true,
          SocialLinks: true,
        },
      });
    }

    // If still not found, return empty profile structure instead of 500/404
    if (!user) {
      return NextResponse.json({
        user_id: params.userId,
        name: "",
        surname: "",
        username: "",
        bio: "",
        website: "",
        location: "",
        date_of_birth: null,
        profile_photo: null,
        SocialLinks: null,
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({
      user_id: params.userId,
      name: "",
      surname: "",
      username: "",
      bio: "",
      website: "",
      location: "",
      date_of_birth: null,
      profile_photo: null,
      SocialLinks: null,
    });
  }
}
