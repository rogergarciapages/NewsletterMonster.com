// C:\Users\Usuario\Documents\GitHub\nm4\src\app\api\upload\profile-image\route.ts
import authOptions from "@/config/auth"; // Add this import
import { prisma } from "@/lib/prisma-client";
import { Client } from "minio";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT!.replace("https://", ""),
  port: 443,
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
});

export async function POST(request: Request) {
  console.log("API Route hit: /api/upload/profile-image");
  
  try {
    const session = await getServerSession(authOptions); // Use authOptions here
    console.log("Full session data:", JSON.stringify(session, null, 2));
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { user_id: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const userId = user.user_id;
    console.log("Processing upload for user:", { email: session.user.email, userId });

    const formData = await request.formData();
    const file = formData.get("file");
    
    console.log("Received file:", {
      exists: !!file,
      isFile: file instanceof File,
      type: file instanceof File ? file.type : null,
      size: file instanceof File ? file.size : null
    });

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No valid file provided" },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type" },
        { status: 400 }
      );
    }

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExt = file.type.split("/")[1];
    const fileName = `${uuidv4()}.${fileExt}`;
    const objectPath = `public/${userId}/${fileName}`;

    console.log("Preparing upload:", {
      userId,
      path: objectPath,
      size: buffer.length,
      type: file.type
    });

    // Create user directory
    const userPath = `public/${userId}/`;
    try {
      await minioClient.putObject(
        process.env.MINIO_BUCKET!,
        userPath,
        Buffer.from(""),
        0
      );
    } catch (dirError) {
      console.log("Directory creation skipped (may exist):", dirError);
    }

    // Upload file
    await minioClient.putObject(
      process.env.MINIO_BUCKET!,
      objectPath,
      buffer,
      file.size,
      { "Content-Type": file.type }
    );

    const fileUrl = `${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET}/${objectPath}`;
    console.log("Upload successful, URL:", fileUrl);

    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}