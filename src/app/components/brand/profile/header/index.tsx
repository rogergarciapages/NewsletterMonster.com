// src/app/components/brand/profile/header/index.tsx
"use client";

import Image from "next/image";

import { Button, CardBody, Chip, Link } from "@nextui-org/react";
import { Brand, SocialLinks } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { BsPatchCheckFill } from "react-icons/bs";
import { FaGithub, FaInstagram, FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";

import { useFollowCount } from "@/hooks/use-follow-count";

import FollowButton from "./follow-button";

// src/app/components/brand/profile/header/index.tsx

interface BrandProfileHeaderProps {
  brandId: string;
  brandName: string;
  brand: Brand & { social_links: SocialLinks | null };
  newsletterCount: number;
  followersCount: number;
  isFollowing: boolean;
  hideFollowButton?: boolean;
  isOwnProfile?: boolean;
}

export default function BrandProfileHeader({
  brandId,
  brandName,
  brand,
  newsletterCount,
  followersCount: initialFollowersCount,
  isFollowing: initialIsFollowing,
  hideFollowButton = false,
  isOwnProfile = false,
}: BrandProfileHeaderProps) {
  const { count: followersCount, updateFollowCount } = useFollowCount({
    initialCount: initialFollowersCount,
    brandId,
  });

  const handleFollowChange = (newIsFollowing: boolean) => {
    updateFollowCount(newIsFollowing);
  };

  const handleClaimBrand = () => {
    // TODO: Implement brand claiming functionality
    console.log("Claim brand clicked");
  };

  return (
    <CardBody className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row">
        {/* Left Column: Logo */}
        <div className="flex-shrink-0">
          {brand.logo ? (
            <Image
              className="h-32 w-32 rounded-full object-cover shadow-lg"
              src={brand.logo}
              alt={`${brandName} logo`}
              width={128}
              height={128}
            />
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-default-100 shadow-lg dark:bg-default-200">
              <span className="text-4xl font-semibold text-default-600">
                {brandName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Main Content Column */}
        <div className="ml-6 flex-grow">
          {/* Brand Name with Verified Badge */}
          <div className="flex items-center gap-2">
            <h1 className="truncate text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
              {brandName}
            </h1>
            {brand.is_claimed && (
              <Chip
                className="border-none bg-primary/10 dark:bg-primary/20"
                startContent={<BsPatchCheckFill className="text-primary" />}
                size="sm"
                variant="flat"
                color="primary"
              >
                Verified
              </Chip>
            )}
          </div>

          {/* Description */}
          <div className="mt-4 max-w-2xl">
            {brand.description ? (
              <p className="text-default-500">{brand.description}</p>
            ) : (
              <div className="text-white">
                <p className="text-default-600">
                  This brand has not been claimed yet. Are you the owner?{" "}
                  <Link href="/brand/claim" className="text-primary">
                    Claim it now!
                  </Link>
                </p>
              </div>
            )}
          </div>

          {/* Stats and Buttons Row */}
          <div className="mt-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
            {/* Stats */}
            <div className="flex items-center gap-8">
              <div className="flex flex-col items-start">
                <span className="text-3xl font-bold text-foreground">{newsletterCount}</span>
                <span className="text-sm text-default-500">newsletters</span>
              </div>
              <div className="flex flex-col items-start">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={followersCount}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-3xl font-bold text-foreground"
                  >
                    {followersCount}
                  </motion.span>
                </AnimatePresence>
                <span className="text-sm text-default-500">followers</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex w-full flex-col gap-2 md:w-[160px]">
              {!hideFollowButton && !isOwnProfile && (
                <FollowButton
                  brandId={brandId}
                  isFollowing={initialIsFollowing}
                  onFollowChange={handleFollowChange}
                />
              )}
              {!brand.is_claimed && !isOwnProfile && (
                <Button
                  onClick={handleClaimBrand}
                  className="h-[44px] font-medium text-white"
                  style={{ backgroundColor: "#fa0036e6" }}
                  startContent={<HiOutlineBuildingOffice2 className="text-xl text-white" />}
                  size="lg"
                >
                  Claim this Brand
                </Button>
              )}
            </div>
          </div>

          {/* Website Link */}
          {brand.website && (
            <div className="mt-4">
              <Link
                href={brand.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary"
                showAnchorIcon
              >
                {new URL(brand.website).hostname}
              </Link>
            </div>
          )}

          {/* Social Links */}
          {brand.social_links && (
            <div className="mt-4 flex space-x-4">
              {brand.social_links.twitter && (
                <Link
                  href={`https://twitter.com/${brand.social_links.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-default-400 hover:text-default-500"
                >
                  <FaTwitter className="h-5 w-5" />
                </Link>
              )}
              {brand.social_links.instagram && (
                <Link
                  href={`https://instagram.com/${brand.social_links.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-default-400 hover:text-default-500"
                >
                  <FaInstagram className="h-5 w-5" />
                </Link>
              )}
              {brand.social_links.linkedin && (
                <Link
                  href={brand.social_links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-default-400 hover:text-default-500"
                >
                  <FaLinkedin className="h-5 w-5" />
                </Link>
              )}
              {brand.social_links.youtube && (
                <Link
                  href={brand.social_links.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-default-400 hover:text-default-500"
                >
                  <FaYoutube className="h-5 w-5" />
                </Link>
              )}
              {brand.social_links.github && (
                <Link
                  href={`https://github.com/${brand.social_links.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-default-400 hover:text-default-500"
                >
                  <FaGithub className="h-5 w-5" />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </CardBody>
  );
}
