import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";

import authOptions from "@/config/auth";
import prisma from "@/lib/prisma";
import { uploadProfileImage, deleteUserProfileImages } from "@/lib/utils/minio";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

function createResponse(status: number, body: any) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return createResponse(401, { error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return createResponse(404, { error: "User not found" });
    }

    const userId = user.user_id;
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return createResponse(400, { error: "No file provided" });
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

    const fileUrl = await uploadProfileImage(file, userId);

    return createResponse(200, {
      url: fileUrl,
      message: "Image uploaded successfully",
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred during upload";

    return createResponse(500, { error: errorMessage });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (user) {
      await deleteUserProfileImages(user.user_id);
    }

    return NextResponse.json({ message: "Profile images cleaned up successfully" });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to delete image",
      },
      { status: 500 }
    );
  }
}
