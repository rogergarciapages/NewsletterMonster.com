import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { socialLinksSchema } from "@/lib/schemas/user-profile";
import { SocialLinksData, updateUserSocialLinks } from "@/lib/services/user";

export const dynamic = "force-dynamic";

// Get a user's social links
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !session?.user?.user_id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const socialLinks = await prisma.socialLinks.findUnique({
      where: {
        user_id: session.user.user_id,
      },
    });

    // Return empty object if no social links exist yet
    return NextResponse.json(
      {
        socialLinks: socialLinks || {},
      },
      {
        headers: {
          "Cache-Control": "no-store, must-revalidate",
          Pragma: "no-cache",
        },
      }
    );
  } catch (error) {
    console.error("Error getting social links:", error);
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 400 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Update a user's social links
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !session?.user?.user_id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    console.log("Received social links update data:", body);

    // Validate the data
    const validatedData = socialLinksSchema.parse(body);

    // Process the cleaned data to remove empty strings
    const cleanedData: SocialLinksData = Object.entries(validatedData).reduce(
      (acc, [key, value]) => {
        // Only include non-empty values
        if (value !== "" && value !== null && value !== undefined) {
          acc[key as keyof SocialLinksData] = value;
        }
        return acc;
      },
      {} as SocialLinksData
    );

    // Update or create social links for the user
    const updatedSocialLinks = await updateUserSocialLinks(session.user.user_id, cleanedData);

    console.log("Social links updated successfully:", updatedSocialLinks);

    return NextResponse.json(
      {
        socialLinks: updatedSocialLinks,
      },
      {
        headers: {
          "Cache-Control": "no-store, must-revalidate",
          Pragma: "no-cache",
        },
      }
    );
  } catch (error) {
    console.error("Error updating social links:", error);
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 400 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
