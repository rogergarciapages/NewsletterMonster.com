import { NextResponse } from "next/server";

import { Client } from "minio";
import { getServerSession } from "next-auth";

import prisma from "@/lib/prisma";
import { userProfileSchema } from "@/lib/schemas/user-profile";

export const dynamic = "force-dynamic";

function getMinioClient() {
  const endpoint = process.env.MINIO_ENDPOINT;
  if (!endpoint) throw new Error("MINIO_ENDPOINT is not set");
  const accessKey = process.env.MINIO_ACCESS_KEY;
  if (!accessKey) throw new Error("MINIO_ACCESS_KEY is not set");
  const secretKey = process.env.MINIO_SECRET_KEY;
  if (!secretKey) throw new Error("MINIO_SECRET_KEY is not set");
  return new Client({
    endPoint: endpoint.replace("https://", ""),
    port: 443,
    useSSL: process.env.MINIO_USE_SSL === "true",
    accessKey,
    secretKey,
  });
}

async function deleteOldImage(imageUrl: string, userId: string) {
  try {
    if (!imageUrl || !imageUrl.includes("/userpics/")) {
      console.log("Invalid image URL format, cannot delete:", imageUrl);
      return;
    }

    console.log(`Attempting to delete old image URL: ${imageUrl}`);

    // Extract the filename from the URL
    const urlParts = imageUrl.split("/");
    const filename = urlParts[urlParts.length - 1];

    // Construct a simple path based on userId and filename
    const objectPath = `public/${userId}/${filename}`;
    console.log(`Deleting image at path: ${objectPath}`);

    const minioClient = getMinioClient();
    try {
      await minioClient.removeObject(process.env.MINIO_BUCKET!, objectPath);
      console.log("Successfully deleted old image:", objectPath);
    } catch (removeError) {
      console.error("Failed to delete old image:", removeError);

      // As a fallback, try to list and delete all files for this user except the current file
      console.log("Attempting fallback cleanup for user:", userId);
      try {
        const objectsList = await minioClient.listObjects(
          process.env.MINIO_BUCKET!,
          `public/${userId}/`,
          true
        );

        for await (const obj of objectsList) {
          console.log(`Found object: ${obj.name}`);
          try {
            await minioClient.removeObject(process.env.MINIO_BUCKET!, obj.name);
            console.log(`Deleted object: ${obj.name}`);
          } catch (e) {
            console.error(`Failed to delete object ${obj.name}:`, e);
          }
        }
      } catch (listError) {
        console.error("Failed to list objects:", listError);
      }
    }
  } catch (error) {
    console.error("Error in deleteOldImage:", error);
    // Don't throw error to allow profile update to continue
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
      profile_photo: body.profile_photo ? "Photo URL exists" : "No photo URL",
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { profile_photo: _, ...dataToValidate } = body;
    const validatedData = userProfileSchema.parse(dataToValidate);

    // Get current user data
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { profile_photo: true },
    });

    console.log("Current user photo:", currentUser?.profile_photo);

    // Delete old image if new one is being uploaded
    if (body.profile_photo && currentUser?.profile_photo) {
      console.log("Detected new image upload, deleting old image");

      // Only delete if URLs are different - avoid unnecessary operations
      if (body.profile_photo !== currentUser.profile_photo) {
        try {
          await deleteOldImage(currentUser.profile_photo, session.user.user_id!);
        } catch (deleteError) {
          console.error("Error deleting old image:", deleteError);
          // Continue with update even if delete fails
        }
      } else {
        console.log("New image URL is identical to existing one, skipping delete operation");
      }
    }

    // Extract only fields that exist in the User model
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

    console.log("Updating user with data:", {
      ...sanitizedData,
      profile_photo: body.profile_photo ? "New photo URL exists" : "No new photo",
    });

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

    console.log("User updated successfully:", {
      ...updatedUser,
      profile_photo: updatedUser.profile_photo ? "Photo URL exists" : "No photo URL",
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
