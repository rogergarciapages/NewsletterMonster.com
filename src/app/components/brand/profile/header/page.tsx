// src/app/components/brand/profile/header/page.tsx
import { Suspense } from "react";

import { prisma } from "@/lib/prisma-client";

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
        surname: true,
        company_name: true,
        username: true,
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

    const newsletterCount = await prisma.newsletter.count({
      where: { user_id: brandId },
    });

    const followersCount = await prisma.follow.count({
      where: { following_id: brandId },
    });

    return {
      user,
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
        <BrandProfileHeaderWrapper
          brandName={params.brandId}
          user={user}
          newsletterCount={newsletterCount}
          followersCount={followersCount}
          isFollowing={false}
          hideFollowButton={false}
          isOwnProfile={false}
        />
      </Suspense>
    </ErrorBoundary>
  );
}
