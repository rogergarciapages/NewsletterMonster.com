"use client";

import { useState } from "react";

import { Brand, SocialLinks } from "@prisma/client";

import LoginModal from "@/app/components/login-modal";

import BrandProfileHeader from "./index";

interface BrandProfileHeaderWrapperProps {
  brandId: string;
  brandName: string;
  brand: Brand & { social_links: SocialLinks | null };
  newsletterCount: number;
  followersCount: number;
  isFollowing: boolean;
  hideFollowButton?: boolean;
  isOwnProfile?: boolean;
}

export default function BrandProfileHeaderWrapper({
  brandId,
  brandName,
  brand,
  newsletterCount,
  followersCount,
  isFollowing,
  hideFollowButton = false,
  isOwnProfile = false,
}: BrandProfileHeaderWrapperProps) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <>
      <BrandProfileHeader
        brandId={brandId}
        brandName={brandName}
        brand={brand}
        newsletterCount={newsletterCount}
        followersCount={followersCount}
        isFollowing={isFollowing}
        hideFollowButton={hideFollowButton}
        isOwnProfile={isOwnProfile}
      />
      <LoginModal isOpen={isLoginModalOpen} onOpenChange={() => setIsLoginModalOpen(false)} />
    </>
  );
}
