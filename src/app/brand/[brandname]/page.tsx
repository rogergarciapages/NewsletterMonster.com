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
    // Find newsletters
    const newsletters = await prisma.newsletter.findMany({
      where: {
        sender: {
          contains: brandname.replace(/-/g, " "),
          mode: "insensitive",
        },
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

    // Create a default user object
    const defaultUser: BrandUser = {
      user_id: "",
      name: formatBrandName(brandname),
      surname: null,
      company_name: formatBrandName(brandname),
      username: brandname,
      email: "",
      profile_photo: null,
      bio: null,
      website: null,
      website_domain: null,
      domain_verified: false,
      twitter_username: null,
      instagram_username: null,
      youtube_channel: null,
      linkedin_profile: null,
      role: "FREE", // Default role for unclaimed brands
    };

    // Try to find a verified user
    const verifiedUser = await prisma.user.findFirst({
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

    const followersCount = await prisma.follow.count({
      where: {
        OR: [{ following_id: verifiedUser?.user_id }, { following_name: brandname }],
      },
    });

    return {
      newsletters,
      user: verifiedUser || defaultUser,
      followersCount,
    };
  } catch (error) {
    console.error("Error in getBrandData:", error);
    // Return default data instead of null
    return {
      newsletters: [],
      user: {
        user_id: "",
        name: formatBrandName(brandname),
        surname: null,
        company_name: formatBrandName(brandname),
        username: brandname,
        email: "",
        profile_photo: null,
        bio: null,
        website: null,
        website_domain: null,
        domain_verified: false,
        twitter_username: null,
        instagram_username: null,
        youtube_channel: null,
        linkedin_profile: null,
        role: "FREE",
      },
      followersCount: 0,
    };
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

  // Should never happen now since getBrandData always returns data
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
            hideFollowButton={false}
            isOwnProfile={false}
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
