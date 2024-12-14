"use client";

import { useState } from "react";

import { Brand, SocialLinks } from "@prisma/client";
import { useSession } from "next-auth/react";

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
  const { data: session } = useSession();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [localFollowersCount, setLocalFollowersCount] = useState(followersCount);

  return (
    <>
      <BrandProfileHeader
        brandId={brandId}
        brandName={brandName}
        brand={brand}
        newsletterCount={newsletterCount}
        followersCount={localFollowersCount}
        isFollowing={isFollowing}
        hideFollowButton={hideFollowButton}
        isOwnProfile={isOwnProfile}
      />
      <LoginModal isOpen={isLoginModalOpen} onOpenChange={() => setIsLoginModalOpen(false)} />
    </>
  );
}
