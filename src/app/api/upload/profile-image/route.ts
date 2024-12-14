// C:\Users\Usuario\Documents\GitHub\nm4\src\app\api\upload\profile-image\route.ts
import { NextResponse } from "next/server";

import { Client } from "minio";
import { getServerSession } from "next-auth";

import authOptions from "@/config/auth";
import { prisma } from "@/lib/prisma";

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

async function deleteExistingProfileImages(bucket: string, userId: string) {
  try {
    const objectsList = await minioClient.listObjects(bucket, `public/${userId}/`, true);
    for await (const obj of objectsList) {
      await minioClient.removeObject(bucket, obj.name);
    }
    console.log(`Deleted existing profile images for user: ${userId}`);
  } catch (error) {
    console.error("Error deleting existing profile images:", error);
  }
}

export async function POST(request: Request) {
  console.log("API Route hit: /api/upload/profile-image");

  try {
    const session = await getServerSession(authOptions);
    console.log("Full session data:", JSON.stringify(session, null, 2));

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { user_id: true, profile_photo: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = user.user_id;
    console.log("Processing upload for user:", { email: session.user.email, userId });

    const formData = await request.formData();
    const file = formData.get("file");

    console.log("Received file:", {
      exists: !!file,
      isFile: file instanceof File,
      type: file instanceof File ? file.type : null,
      size: file instanceof File ? file.size : null,
    });

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No valid file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExt = file.type.split("/")[1].replace("jpeg", "jpg");
    const fileName = `${userId}.${fileExt}`; // Use userId as filename
    const objectPath = `public/${userId}/${fileName}`;

    console.log("Preparing upload:", {
      userId,
      path: objectPath,
      size: buffer.length,
      type: file.type,
    });

    // Delete existing profile images
    await deleteExistingProfileImages(process.env.MINIO_BUCKET!, userId);

    // Upload new file
    await minioClient.putObject(process.env.MINIO_BUCKET!, objectPath, buffer, file.size, {
      "Content-Type": file.type,
      "Cache-Control": "no-cache",
    });

    const fileUrl = `${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET}/${objectPath}`;
    console.log("Upload successful, URL:", fileUrl);

    // Update user's profile_photo in database
    await prisma.user.update({
      where: { user_id: userId },
      data: { profile_photo: fileUrl },
    });

    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
