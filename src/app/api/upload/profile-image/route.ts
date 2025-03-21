// C:\Users\Usuario\Documents\GitHub\nm4\src\app\api\upload\profile-image\route.ts
import { NextResponse } from "next/server";

import { Client } from "minio";
import { getServerSession } from "next-auth";

import authOptions from "@/config/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT!.replace("https://", ""),
  port: 443,
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
});

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
    const fileName = `${userId}-${Date.now()}.${fileExt}`; // Use timestamp for unique filename
    const objectPath = `public/${userId}/${fileName}`;

    // Store transaction data for potential rollback
    pendingUploads.set(transactionId, {
      userId,
      objectPath,
      oldImageUrl: user.profile_photo,
    });

    // First phase: Upload file without deleting old image yet
    await minioClient.putObject(process.env.MINIO_BUCKET!, objectPath, buffer, file.size, {
      "Content-Type": file.type,
      "Cache-Control": "no-cache",
      "x-amz-meta-transaction-id": transactionId,
    });

    const fileUrl = `${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET}/${objectPath}`;

    // Second phase: Now that upload succeeded, delete old images
    if (user.profile_photo) {
      await deleteExistingProfileImages(process.env.MINIO_BUCKET!, userId);
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
