import { prisma } from "@/lib/prisma-client";
import { userProfileSchema } from "@/lib/schemas/user-profile";
import { Client } from "minio";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT!.replace("https://", ""),
  port: 443,
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!
});

async function deleteOldImage(imageUrl: string, userId: string) {
  try {
    // Extract the filename from the full URL path
    const urlParts = imageUrl.split("/");
    const fileName = urlParts[urlParts.length - 1];
    const objectPath = `public/${userId}/${fileName}`;

    console.log("Attempting to delete old image:", objectPath);
    
    await minioClient.removeObject(process.env.MINIO_BUCKET!, objectPath);
    console.log("Successfully deleted old image:", objectPath);
  } catch (error) {
    console.error("Error deleting old image:", error);
  }
}


export async function PUT(request: Request) {
  try {
    console.log("Starting profile update process");
    
    const session = await getServerSession();
    if (!session?.user?.email) {
      console.log("No session found");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    console.log("Received update data:", {
      ...body,
      profile_photo: body.profile_photo ? "Photo URL exists" : "No photo URL"
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { profile_photo: _, ...dataToValidate } = body;
    const validatedData = userProfileSchema.parse(dataToValidate);

    // Get current user data
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { profile_photo: true }
    });

    console.log("Current user photo:", currentUser?.profile_photo);

    // Delete old image if new one is being uploaded
    if (body.profile_photo && currentUser?.profile_photo) {
      console.log("Detected new image upload, deleting old image");
      await deleteOldImage(currentUser.profile_photo, session.user.user_id!);
    }

    console.log("Updating user with data:", {
      ...validatedData,
      profile_photo: body.profile_photo ? "New photo URL exists" : "No new photo"
    });

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

    console.log("User updated successfully:", {
      ...updatedUser,
      profile_photo: updatedUser.profile_photo ? "Photo URL exists" : "No photo URL"
    });

    return NextResponse.json({
      user: updatedUser
    }, {
      headers: {
        "Cache-Control": "no-store, must-revalidate",
        "Pragma": "no-cache",
      }
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 400 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}