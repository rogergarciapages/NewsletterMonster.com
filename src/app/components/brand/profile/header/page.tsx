// src/app/components/brand/profile/header/page.tsx
import { Suspense } from "react";

import prisma from "@/lib/prisma";

import BrandProfileHeaderWrapper from "./client-wrapper";
import { ErrorBoundary } from "./error-boundary";
import Loading from "./loading";

async function getBrandData(brandId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { user_id: brandId },
      select: {
        user_id: true,
        name: true,
        email: true,
        profile_photo: true,
        bio: true,
        website: true,
        emailVerified: true,
        role: true,
        status: true,
      },
    });

    const newsletterCount = await prisma.newsletter.count({
      where: { user_id: brandId },
    });

    const followersCount = await prisma.follow.count({
      where: { brand_id: brandId },
    });

    return {
      user: user
        ? {
            brand_id: user.user_id,
            name: user.name,
            slug: user.user_id,
            description: user.bio,
            website: user.website,
            domain: null,
            logo: user.profile_photo,
            is_claimed: user.emailVerified !== null,
            is_verified: user.emailVerified !== null,
            created_at: null,
            updated_at: null,
            social_links: null,
          }
        : null,
      newsletterCount,
      followersCount,
    };
  } catch (error) {
    console.error("Error fetching brand data:", error);
    return {
      user: null,
      newsletterCount: 0,
      followersCount: 0,
    };
  }
}

export default async function BrandProfilePage({ params }: { params: { brandId: string } }) {
  const { user, newsletterCount, followersCount } = await getBrandData(params.brandId);

  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        {user && (
          <BrandProfileHeaderWrapper
            brandId={params.brandId}
            brandName={user.name}
            brand={{
              brand_id: user.brand_id,
              name: user.name,
              slug: user.slug,
              description: user.description,
              website: user.website,
              domain: user.domain,
              logo: user.logo,
              is_claimed: user.is_claimed,
              is_verified: user.is_verified,
              created_at: user.created_at,
              updated_at: user.updated_at,
              social_links: user.social_links,
            }}
            newsletterCount={newsletterCount}
            followersCount={followersCount}
            isFollowing={false}
            hideFollowButton={false}
            isOwnProfile={false}
          />
        )}
      </Suspense>
    </ErrorBoundary>
  );
}
