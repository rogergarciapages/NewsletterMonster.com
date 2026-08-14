import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";

import prisma from "@/lib/prisma";
import { userProfileSchema } from "@/lib/schemas/user-profile";
import { deleteUserProfileImages } from "@/lib/utils/minio";

export const dynamic = "force-dynamic";

async function deleteOldImage(imageUrl: string, userId: string) {
  try {
    if (!imageUrl) return;
    await deleteUserProfileImages(userId);
  } catch (error) {
    console.error("Error in deleteOldImage:", error);
  }
}

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

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { profile_photo: true, user_id: true },
    });

    if (body.profile_photo && currentUser?.profile_photo) {
      if (body.profile_photo !== currentUser.profile_photo) {
        try {
          await deleteOldImage(currentUser.profile_photo, currentUser.user_id);
        } catch (deleteError) {
          console.error("Error deleting old image:", deleteError);
        }
      }
    }

    const allowedFields = ["name", "surname", "username", "bio", "website", "location"];

    const sanitizedData = Object.keys(validatedData).reduce(
      (acc, key) => {
        if (allowedFields.includes(key)) {
          acc[key] = validatedData[key as keyof typeof validatedData];
        }
        return acc;
      },
      {} as Record<string, any>
    );

    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        ...sanitizedData,
        ...(body.profile_photo ? { profile_photo: body.profile_photo } : {}),
        updated_at: new Date(),
      },
    });

    return NextResponse.json(
      {
        user: updatedUser,
      },
      {
        headers: {
          "Cache-Control": "no-store, must-revalidate",
          Pragma: "no-cache",
        },
      }
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 400 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
