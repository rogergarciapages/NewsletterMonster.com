// src/app/api/users/profile/route.ts
import { prisma } from "@/lib/prisma-client";
import { userProfileSchema } from "@/lib/schemas/user-profile";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PUT(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    
    // Remove profile_photo from validation schema temporarily
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { profile_photo: _, ...dataToValidate } = body;
    const validatedData = userProfileSchema.parse(dataToValidate);

    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email
      },
      data: {
        ...validatedData,
        // Only update profile_photo if a new URL is provided
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