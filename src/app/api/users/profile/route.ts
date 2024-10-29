// src/app/api/users/profile/route.ts
import { prisma } from "@/lib/prisma-client";
import { userProfileSchema } from "@/lib/schemas/user-profile";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const validatedData = userProfileSchema.parse(body);

    // Remove profile_photo from the data as it's handled separately
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { profile_photo, ...updateData } = validatedData;

    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        ...updateData,
        // Only update profile_photo if a new URL is provided
        ...(body.profile_photo_url ? { profile_photo: body.profile_photo_url } : {}),
        updated_at: new Date(),
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Profile update error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}