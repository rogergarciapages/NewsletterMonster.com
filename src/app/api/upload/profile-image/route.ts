// src/app/api/upload/profile-image/route.ts
import { Client } from "minio";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";


const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT.replace("https://", ""),
  port: 443,
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    
    if (!file || !(file instanceof File)) {
      return new NextResponse("No valid file provided", { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return new NextResponse("Invalid file type", { status: 400 });
    }

    // Validate file size (e.g., 5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return new NextResponse("File too large", { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExt = file.name.split(".").pop() || "jpg";
    const fileName = `${uuidv4()}.${fileExt}`;

    await minioClient.putObject(
      process.env.MINIO_BUCKET,
      fileName,
      buffer,
      file.size,
      { "Content-Type": file.type }
    );

    const fileUrl = `${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET}/${fileName}`;

    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error("Error uploading file:", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Error uploading file", 
      { status: 500 }
    );
  }
}