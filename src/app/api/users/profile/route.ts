import { prisma } from "@/lib/prisma-client";
import { userProfileSchema } from "@/lib/schemas/user-profile";
import { Client } from "minio";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT!.replace("https://", ""),
  port: 443,
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!
});

async function deleteOldImage(imageUrl: string) {
  try {
    const objectName = imageUrl.split("/").pop();
    if (objectName) {
      await minioClient.removeObject(process.env.MINIO_BUCKET!, objectName);
    }
  } catch (error) {
    console.error("Error deleting old image:", error);
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

    // Get current user data to check for existing profile photo
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { profile_photo: true }
    });

    // Delete old image if new one is being uploaded
    if (body.profile_photo && currentUser?.profile_photo) {
      await deleteOldImage(currentUser.profile_photo);
    }

    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email
      },
      data: {
        ...validatedData,
        ...(body.profile_photo ? { profile_photo: body.profile_photo } : {}),
        updated_at: new Date()
      }
    });

    return NextResponse.json({
      user: updatedUser
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 400 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}