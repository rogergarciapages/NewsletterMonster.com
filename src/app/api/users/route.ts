// src/app/api/users/profile/route.ts
import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma-client";
import { userProfileSchema } from "@/lib/schemas/user-profile";
import { deleteUserProfileImages, isMinioUrl } from "@/lib/utils/minio";

export async function PUT(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { profile_photo: _, ...dataToValidate } = body;
    const validatedData = userProfileSchema.parse(dataToValidate);

    // Get current user data
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { profile_photo: true },
    });

    // Delete old image if it exists and is from our MinIO storage
    if (currentUser?.profile_photo && isMinioUrl(currentUser.profile_photo) && body.profile_photo) {
      try {
        await deleteUserProfileImages(currentUser.profile_photo);
      } catch (error) {
        console.error("Failed to delete old profile image:", error);
        // Continue with update even if delete fails
      }
    }

    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        ...validatedData,
        ...(body.profile_photo ? { profile_photo: body.profile_photo } : {}),
        updated_at: new Date(),
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 400 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
