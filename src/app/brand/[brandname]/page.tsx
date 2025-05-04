import { Metadata } from "next";
import { notFound } from "next/navigation";

import { Card } from "@nextui-org/react";
import { getServerSession } from "next-auth";

import NewsletterGrid from "@/app/components/brand/newsletter/grid";
import { Newsletter } from "@/app/components/brand/newsletter/types";
import BrandProfileHeaderWrapper from "@/app/components/brand/profile/header/client-wrapper";
import {
  BrandStructuredData,
  generateBrandMetadata,
} from "@/app/components/brand/seo/brand-page-seo";
import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";
import { authOptions } from "@/config/auth";
import prisma from "@/lib/prisma";

// Add dynamic configuration
export const dynamic = "force-dynamic"; // Always fetch fresh data since we have real-time follower counts
export const revalidate = 300; // Revalidate every 5 minutes for SEO metadata

interface BrandData {
  brand: {
    brand_id: string;
    name: string;
    slug: string;
    description: string | null;
    website: string | null;
    domain: string | null;
    logo: string | null;
    is_claimed: boolean;
    is_verified: boolean;
    created_at: Date | null;
    updated_at: Date | null;
    followers_count: number;
    SocialLinks: {
      instagram?: string;
      twitter?: string;
      linkedin?: string;
      facebook?: string;
      youtube?: string;
      github?: string;
    } | null;
  };
  newsletters: Newsletter[];
  followersCount: number;
  isFollowing: boolean;
}

export async function generateMetadata({
  params,
}: {
  params: { brandname: string };
}): Promise<Metadata> {
  const data = await getBrandData(params.brandname);
  if (!data) return notFound();

  return generateBrandMetadata({
    brandname: params.brandname,
    displayName: data.brand.name,
    newsletters: data.newsletters,
    followersCount: data.followersCount,
    user: {
      user_id: data.brand.brand_id,
      name: data.brand.name,
      surname: "",
      company_name: data.brand.name,
      username: data.brand.slug,
      email: "",
      profile_photo: data.brand.logo,
      bio: data.brand.description,
      website: data.brand.website,
      website_domain: data.brand.domain,
      domain_verified: data.brand.is_verified,
      twitter_username: data.brand.SocialLinks?.twitter || null,
      instagram_username: data.brand.SocialLinks?.instagram || null,
      youtube_channel: data.brand.SocialLinks?.youtube || null,
      linkedin_profile: data.brand.SocialLinks?.linkedin || null,
      role: "BRAND",
    },
  });
}

export const viewport = {
  themeColor: "#d7002e",
  width: "device-width",
  initialScale: 1,
};

async function getBrandData(brandSlug: string): Promise<BrandData | null> {
  try {
    console.log(`Fetching brand data for slug: ${brandSlug}`);
    const session = await getServerSession(authOptions);

    // First try to find brand by slug
    let brand = await prisma.brand.findUnique({
      where: { slug: brandSlug },
      include: {
        SocialLinks: true,
        Newsletter: {
          orderBy: { created_at: "desc" },
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
        },
        _count: {
          select: {
            Follow: true,
          },
        },
      },
    });

    // If not found by slug, try to find by newsletter sender_slug
    if (!brand) {
      console.log(`No brand found by slug, trying newsletter sender_slug: ${brandSlug}`);
      const newsletter = await prisma.newsletter.findFirst({
        where: { sender_slug: brandSlug },
        include: {
          Brand: {
            include: {
              SocialLinks: true,
              Newsletter: {
                orderBy: { created_at: "desc" },
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
              },
              _count: {
                select: {
                  Follow: true,
                },
              },
            },
          },
        },
      });

      brand = newsletter?.Brand || null;
    }

    if (!brand) {
      console.log(`No brand found for slug: ${brandSlug}`);
      return null;
    }

    console.log(`Found brand: ${brand.name}`);

    // Check if the current user is following this brand
    let isFollowing = false;
    if (session?.user?.user_id) {
      const follow = await prisma.follow.findUnique({
        where: {
          follower_id_brand_id: {
            follower_id: session.user.user_id,
            brand_id: brand.brand_id,
          },
        },
      });
      isFollowing = !!follow;
    }

    return {
      brand: {
        brand_id: brand.brand_id,
        name: brand.name,
        slug: brand.slug,
        description: brand.description,
        website: brand.website,
        domain: brand.domain,
        logo: brand.logo,
        is_claimed: brand.is_claimed,
        is_verified: brand.is_verified,
        created_at: brand.created_at,
        updated_at: brand.updated_at,
        followers_count: brand._count.Follow,
        SocialLinks: brand.SocialLinks
          ? {
              instagram: brand.SocialLinks.instagram || undefined,
              twitter: brand.SocialLinks.twitter || undefined,
              linkedin: brand.SocialLinks.linkedin || undefined,
              facebook: brand.SocialLinks.facebook || undefined,
              youtube: brand.SocialLinks.youtube || undefined,
              github: brand.SocialLinks.github || undefined,
            }
          : null,
      },
      newsletters: brand.Newsletter,
      followersCount: brand._count.Follow,
      isFollowing,
    };
  } catch (error) {
    console.error("Error in getBrandData:", error);
    throw error; // Re-throw to trigger error boundary
  }
}

export default async function BrandPage({ params }: { params: { brandname: string } }) {
  const data = await getBrandData(params.brandname);

  if (!data) {
    notFound();
  }

  const { brand, newsletters, followersCount, isFollowing } = data;

  // Get current session to check if this is the user's own profile
  const session = await getServerSession(authOptions);
  const isOwnProfile = session?.user?.user_id === brand.brand_id;

  return (
    <>
      <BrandStructuredData
        brandname={params.brandname}
        displayName={brand.name}
        newsletters={newsletters}
        followersCount={followersCount}
        user={{
          user_id: brand.brand_id,
          name: brand.name,
          surname: "",
          company_name: brand.name,
          username: brand.slug,
          email: "",
          profile_photo: brand.logo,
          bio: brand.description,
          website: brand.website,
          website_domain: brand.domain,
          domain_verified: brand.is_verified,
          twitter_username: brand.SocialLinks?.twitter || null,
          instagram_username: brand.SocialLinks?.instagram || null,
          youtube_channel: brand.SocialLinks?.youtube || null,
          linkedin_profile: brand.SocialLinks?.linkedin || null,
          role: "BRAND",
        }}
      />

      <ThreeColumnLayout>
        <div className="w-full space-y-4">
          {/* Brand Profile Header */}
          <Card className="mt-4 border-none bg-background/60 dark:bg-default-100/50">
            <BrandProfileHeaderWrapper
              brandId={brand.brand_id}
              brandName={brand.name}
              brand={{
                ...brand,
                SocialLinks: brand.SocialLinks
                  ? {
                      id: brand.brand_id,
                      brand_id: brand.brand_id,
                      user_id: null,
                      instagram: brand.SocialLinks.instagram || null,
                      twitter: brand.SocialLinks.twitter || null,
                      linkedin: brand.SocialLinks.linkedin || null,
                      facebook: brand.SocialLinks.facebook || null,
                      youtube: brand.SocialLinks.youtube || null,
                      github: brand.SocialLinks.github || null,
                    }
                  : null,
              }}
              newsletterCount={newsletters.length}
              followersCount={followersCount}
              isFollowing={isFollowing}
              hideFollowButton={false}
              isOwnProfile={isOwnProfile}
            />
          </Card>

          {/* Newsletters Grid */}
          <NewsletterGrid initialNewsletters={newsletters} brandname={params.brandname} />
        </div>
      </ThreeColumnLayout>
    </>
  );
}
