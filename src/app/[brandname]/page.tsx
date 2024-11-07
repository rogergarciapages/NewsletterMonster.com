// src/app/[brandname]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";

import NewsletterCard from "@/app/components/brand/newsletter/card";
import { Newsletter } from "@/app/components/brand/newsletter/types";
import BrandProfileHeaderWrapper from "@/app/components/brand/profile/header/client-wrapper";
import { BrandUser } from "@/app/components/brand/profile/types";
import {
  BrandStructuredData,
  generateBrandMetadata,
} from "@/app/components/brand/seo/brand-page-seo";
import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";
import { prisma } from "@/lib/prisma-client";

interface BrandData {
  newsletters: Newsletter[];
  user: BrandUser;
  followersCount: number;
}

function formatBrandName(brandname: string): string {
  return brandname
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function getBrandData(brandname: string): Promise<BrandData | null> {
  try {
    const brandUser = await prisma.user.findFirst({
      where: {
        OR: [
          { company_name: { contains: brandname.replace(/-/g, " "), mode: "insensitive" } },
          { username: { equals: brandname, mode: "insensitive" } },
        ],
      },
      select: {
        user_id: true,
        name: true,
        surname: true,
        company_name: true,
        username: true,
        email: true,
        profile_photo: true,
        bio: true,
        website: true,
        website_domain: true,
        domain_verified: true,
        twitter_username: true,
        instagram_username: true,
        youtube_channel: true,
        linkedin_profile: true,
        role: true,
      },
    });

    if (!brandUser) return null;

    const newsletters = await prisma.newsletter.findMany({
      where: {
        OR: [
          {
            sender: {
              contains: brandname.replace(/-/g, " "),
              mode: "insensitive",
            },
          },
          {
            user_id: brandUser?.user_id,
          },
        ],
      },
      orderBy: {
        created_at: "desc",
      },
      select: {
        newsletter_id: true,
        sender: true,
        subject: true,
        top_screenshot_url: true,
        likes_count: true,
        you_rocks_count: true,
        created_at: true,
        summary: true,
        user_id: true,
      },
    });

    const followersCount = await prisma.follow.count({
      where: {
        OR: [{ following_id: brandUser.user_id }, { following_name: brandname }],
      },
    });

    const user: BrandUser = {
      ...brandUser,
      website_domain: brandUser.website_domain || null,
      domain_verified: brandUser.domain_verified || false,
    };

    return {
      newsletters,
      user,
      followersCount,
    };
  } catch (error) {
    console.error("Error fetching brand data:", error);
    return null;
  }
}
export async function generateMetadata({
  params,
}: {
  params: { brandname: string };
}): Promise<Metadata> {
  const data = await getBrandData(params.brandname);
  if (!data) return notFound();

  const displayName = formatBrandName(params.brandname);

  return generateBrandMetadata({
    brandname: params.brandname,
    displayName,
    newsletters: data.newsletters,
    user: data.user,
    followersCount: data.followersCount,
  });
}

export const viewport = {
  themeColor: "#d7002e",
  width: "device-width",
  initialScale: 1,
};

export default async function BrandPage({ params }: { params: { brandname: string } }) {
  const data = await getBrandData(params.brandname);

  if (!data) {
    notFound();
  }

  const { newsletters, user, followersCount } = data;
  const brandDisplayName = formatBrandName(params.brandname);

  return (
    <>
      <BrandStructuredData
        brandname={params.brandname}
        displayName={brandDisplayName}
        newsletters={newsletters}
        user={user}
        followersCount={followersCount}
      />

      <ThreeColumnLayout>
        <div className="w-full text-[#111]">
          <BrandProfileHeaderWrapper
            brandName={brandDisplayName}
            user={user}
            newsletterCount={newsletters.length}
            followersCount={followersCount}
            isFollowing={false}
          />

          <main className="mx-auto max-w-6xl px-1 py-8">
            <h1 className="sr-only">{brandDisplayName} Newsletters</h1>
            {newsletters.length > 0 ? (
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                {newsletters.map(newsletter => (
                  <NewsletterCard
                    key={newsletter.newsletter_id}
                    newsletter={newsletter}
                    brandname={params.brandname}
                  />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <h2 className="mb-2 text-xl font-semibold">No Newsletters Yet</h2>
                <p className="text-gray-600">
                  This brand hasn&apos;t published any newsletters yet.
                </p>
              </div>
            )}
          </main>
        </div>
      </ThreeColumnLayout>
    </>
  );
}
