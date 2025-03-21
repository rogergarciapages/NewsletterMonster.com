// src/app/components/brand/profile/header/index.tsx
"use client";

import Image from "next/image";

import { Card, CardBody, Chip, Link } from "@nextui-org/react";
import { Brand, SocialLinks } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { BsPatchCheckFill } from "react-icons/bs";
import { FaGithub, FaInstagram, FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa";

import { useFollowCount } from "@/hooks/use-follow-count";

import FollowButton from "./follow-button";

// src/app/components/brand/profile/header/index.tsx

interface BrandProfileHeaderProps {
  brandId: string;
  brandName: string;
  brand: Brand & { SocialLinks: SocialLinks | null };
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

  return (
    <Card className="mt-4 border-none bg-background/60 dark:bg-default-100/50">
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
              {brand.is_verified && (
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
                  <p className="text-default-600">No description available yet.</p>
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
            {brand.SocialLinks && (
              <div className="mt-4 flex space-x-4">
                {brand.SocialLinks.twitter && (
                  <Link
                    href={`https://twitter.com/${brand.SocialLinks.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaTwitter className="h-5 w-5" />
                  </Link>
                )}
                {brand.SocialLinks.instagram && (
                  <Link
                    href={`https://instagram.com/${brand.SocialLinks.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaInstagram className="h-5 w-5" />
                  </Link>
                )}
                {brand.SocialLinks.linkedin && (
                  <Link href={brand.SocialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                    <FaLinkedin className="h-5 w-5" />
                  </Link>
                )}
                {brand.SocialLinks.youtube && (
                  <Link href={brand.SocialLinks.youtube} target="_blank" rel="noopener noreferrer">
                    <FaYoutube className="h-5 w-5" />
                  </Link>
                )}
                {brand.SocialLinks.github && (
                  <Link
                    href={`https://github.com/${brand.SocialLinks.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaGithub className="h-5 w-5" />
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
