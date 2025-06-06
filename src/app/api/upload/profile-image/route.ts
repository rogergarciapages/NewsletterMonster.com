// C:\Users\Usuario\Documents\GitHub\nm4\src\app\api\upload\profile-image\route.ts
import { NextResponse } from "next/server";

import { Client } from "minio";
import { getServerSession } from "next-auth";

import authOptions from "@/config/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Move MinIO client initialization into a function
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

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

// Keep track of uploads in memory for handling potential rollbacks
const pendingUploads = new Map<
  string,
  {
    userId: string;
    objectPath: string;
    oldImageUrl?: string | null;
  }
>();

/**
 * Delete existing profile images for a user
 */
async function deleteExistingProfileImages(bucket: string, userId: string): Promise<void> {
  try {
    const minioClient = getMinioClient();
    const objectsList = await minioClient.listObjects(bucket, `public/${userId}/`, true);
    for await (const obj of objectsList) {
      await minioClient.removeObject(bucket, obj.name);
    }
  } catch (error) {
    throw new Error(
      `Failed to delete existing profile images: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Handle profile image upload with transaction support
 */
export async function POST(request: Request) {
  // Create a structured response helper
  const createResponse = (status: number, data: object) => {
    return NextResponse.json(data, {
      status,
      headers: {
        "Cache-Control": "no-store, must-revalidate",
        Pragma: "no-cache",
      },
    });
  };

  try {
    // Authentication check
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return createResponse(401, { error: "You must be logged in to upload an image" });
    }

    // Get user data
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { user_id: true, profile_photo: true },
    });

    if (!user) {
      return createResponse(404, { error: "User not found" });
    }

    const userId = user.user_id;
    const formData = await request.formData();
    const file = formData.get("file");
    const transactionId = (formData.get("transaction_id") as string) || `default-${Date.now()}`;

    // Validate request data
    if (!file || !(file instanceof File)) {
      return createResponse(400, { error: "No valid file provided" });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return createResponse(400, {
        error: `Invalid file type: ${file.type}. Allowed types: ${ALLOWED_TYPES.join(", ")}`,
      });
    }

    if (file.size > MAX_FILE_SIZE) {
      return createResponse(400, {
        error: `File too large: ${(file.size / (1024 * 1024)).toFixed(2)}MB. Maximum size: 2MB`,
      });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExt = file.type.split("/")[1].replace("jpeg", "jpg");
    const fileName = `${userId}.${fileExt}`;
    const objectPath = `public/${userId}/${fileName}`;

    console.log("Image upload details:", {
      fileType: file.type,
      extractedExtension: fileExt,
      fileName,
      objectPath,
    });

    // Store transaction data for potential rollback
    pendingUploads.set(transactionId, {
      userId,
      objectPath,
      oldImageUrl: user.profile_photo,
    });

    // First, delete any existing files with same name to avoid conflicts
    const minioClient = getMinioClient();
    try {
      console.log("Checking for existing file at path:", objectPath);
      await minioClient.statObject(process.env.MINIO_BUCKET!, objectPath);
      console.log("Existing file found, removing first");
      await minioClient.removeObject(process.env.MINIO_BUCKET!, objectPath);
    } catch (statErr) {
      // File doesn't exist, which is fine
      console.log("No existing file at path, proceeding with upload");
    }

    // Now upload the new file
    console.log("Uploading new image to:", objectPath);
    await minioClient.putObject(process.env.MINIO_BUCKET!, objectPath, buffer, file.size, {
      "Content-Type": file.type,
      "Cache-Control": "no-cache",
      "x-amz-meta-transaction-id": transactionId,
    });

    // Verify the upload was successful
    try {
      await minioClient.statObject(process.env.MINIO_BUCKET!, objectPath);
      console.log("Verified image uploaded successfully");
    } catch (err) {
      console.error("Failed to verify upload:", err);
      throw new Error("Failed to verify image upload");
    }

    // Construct the URL to match the expected pattern
    const fileUrl = `${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET}/${objectPath}`;
    console.log("Constructed image URL:", fileUrl);

    // Create artificial delay to allow for storage consistency
    console.log("Adding short delay to ensure storage consistency...");
    await new Promise(resolve => setTimeout(resolve, 500));

    // Clean up other old images (if any)
    if (user.profile_photo) {
      try {
        console.log("Cleaning up other old images");
        const objectsList = await minioClient.listObjects(
          process.env.MINIO_BUCKET!,
          `public/${userId}/`,
          true
        );

        for await (const obj of objectsList) {
          // Don't delete the file we just uploaded
          if (obj.name !== objectPath) {
            console.log(`Deleting old image: ${obj.name}`);
            await minioClient.removeObject(process.env.MINIO_BUCKET!, obj.name);
          }
        }
      } catch (deleteErr) {
        console.error("Error during cleanup of old images:", deleteErr);
        // Don't fail the whole operation if cleanup fails
      }
    }

    // Upload completed successfully, remove from pending
    pendingUploads.delete(transactionId);

    return createResponse(200, {
      url: fileUrl,
      message: "Image uploaded successfully",
    });
  } catch (error) {
    // Format error message
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred during upload";

    return createResponse(500, { error: errorMessage });
  }
}

/**
 * Rollback a previously started upload transaction
 */
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get("transactionId");

    if (!transactionId || !pendingUploads.has(transactionId)) {
      return NextResponse.json({ error: "Invalid transaction ID" }, { status: 400 });
    }

    const transaction = pendingUploads.get(transactionId)!;

    // Delete the uploaded file
    const minioClient = getMinioClient();
    await minioClient.removeObject(process.env.MINIO_BUCKET!, transaction.objectPath);

    // Remove transaction from pending
    pendingUploads.delete(transactionId);

    return NextResponse.json({ message: "Upload transaction cancelled successfully" });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to cancel upload",
      },
      { status: 500 }
    );
  }
}
