"use client";

import { useState } from "react";

import { Brand, SocialLinks } from "@prisma/client";

import LoginModal from "@/app/components/login-modal";

import BrandProfileHeader from "./index";

interface BrandProfileHeaderProps {
  brand: Brand & {
    SocialLinks: SocialLinks | null;
  };
  brandId: string;
  brandName: string;
  newsletterCount: number;
  followersCount: number;
  isFollowing: boolean;
  hideFollowButton?: boolean;
  isOwnProfile?: boolean;
}

export default function BrandProfileHeaderWrapper({
  brand,
  brandId,
  brandName,
  newsletterCount,
  followersCount,
  isFollowing,
  hideFollowButton,
  isOwnProfile,
}: BrandProfileHeaderProps) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleOpenLoginModal = () => {
    setIsLoginModalOpen(true);
  };

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
