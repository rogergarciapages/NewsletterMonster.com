import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/config/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { name, slug, description, website, domain, logo } = data;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json({ error: "Name and slug are required fields" }, { status: 400 });
    }

    // Check if slug is already taken
    const existingBrand = await prisma.brand.findFirst({
      where: {
        OR: [{ slug }, { domain: domain || undefined }],
      },
    });

    if (existingBrand) {
      return NextResponse.json(
        {
          error:
            existingBrand.slug === slug
              ? "This brand URL is already taken"
              : "This domain is already registered",
        },
        { status: 400 }
      );
    }

    // Create brand and brand manager in a transaction
    const brand = await prisma.$transaction(async tx => {
      // Create the brand
      const newBrand = await tx.brand.create({
        data: {
          name,
          slug,
          description,
          website,
          domain,
          logo,
          is_claimed: true,
          is_verified: false,
        },
      });

      // Create brand manager entry for the creator
      await tx.brandManager.create({
        data: {
          user_id: session.user.user_id,
          brand_id: newBrand.brand_id,
          role: "OWNER",
          permissions: ["VIEW", "EDIT", "PUBLISH", "MANAGE_USERS"],
        },
      });

      return newBrand;
    });

    return NextResponse.json(brand);
  } catch (error) {
    console.error("Error creating brand:", error);
    return NextResponse.json({ error: "Failed to create brand" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    const brands = await prisma.brand.findMany({
      where: query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { slug: { contains: query, mode: "insensitive" } },
              { domain: { contains: query, mode: "insensitive" } },
            ],
          }
        : undefined,
      include: {
        _count: {
          select: {
            followers: true,
            newsletters: true,
          },
        },
        social_links: true,
      },
      take: limit,
      skip: offset,
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json(brands);
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json({ error: "Failed to fetch brands" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { brandId, ...updateData } = data;

    if (!brandId) {
      return NextResponse.json({ error: "Brand ID is required" }, { status: 400 });
    }

    // Check if user has permission to update this brand
    const brandManager = await prisma.brandManager.findFirst({
      where: {
        brand_id: brandId,
        user_id: session.user.user_id,
        permissions: { has: "EDIT" },
      },
    });

    if (!brandManager) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    // Update brand
    const brand = await prisma.brand.update({
      where: { brand_id: brandId },
      data: updateData,
    });

    return NextResponse.json(brand);
  } catch (error) {
    console.error("Error updating brand:", error);
    return NextResponse.json({ error: "Failed to update brand" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const brandId = searchParams.get("brandId");

    if (!brandId) {
      return NextResponse.json({ error: "Brand ID is required" }, { status: 400 });
    }

    // Check if user has permission to delete this brand
    const brandManager = await prisma.brandManager.findFirst({
      where: {
        brand_id: brandId,
        user_id: session.user.user_id,
        role: "OWNER",
      },
    });

    if (!brandManager) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    // Delete brand (this will cascade to all related records)
    await prisma.brand.delete({
      where: { brand_id: brandId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting brand:", error);
    return NextResponse.json({ error: "Failed to delete brand" }, { status: 500 });
  }
}
