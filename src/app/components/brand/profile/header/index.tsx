// src/app/components/brand/profile/header/index.tsx
"use client";

import Image from "next/image";
import { useState } from "react";

import { Card, CardBody, Chip, Link } from "@nextui-org/react";
import { Brand, SocialLinks } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { BsPatchCheckFill } from "react-icons/bs";
import { FaGithub, FaInstagram, FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa";

import FollowButton from "@/app/components/follow-button";

// src/app/components/brand/profile/header/index.tsx

// src/app/components/brand/profile/header/index.tsx

// src/app/components/brand/profile/header/index.tsx

// src/app/components/brand/profile/header/index.tsx

// src/app/components/brand/profile/header/index.tsx

// src/app/components/brand/profile/header/index.tsx

// src/app/components/brand/profile/header/index.tsx

// src/app/components/brand/profile/header/index.tsx

// src/app/components/brand/profile/header/index.tsx

// src/app/components/brand/profile/header/index.tsx

// src/app/components/brand/profile/header/index.tsx

// src/app/components/brand/profile/header/index.tsx

// src/app/components/brand/profile/header/index.tsx

// src/app/components/brand/profile/header/index.tsx

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
  const [followerCount, setFollowerCount] = useState(initialFollowersCount);
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);

  // Handler for optimistic updates from FollowButton
  const handleFollowChange = (newIsFollowing: boolean, countDelta: number) => {
    setIsFollowing(newIsFollowing);
    setFollowerCount(prev => prev + countDelta);
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
          <div className="mt-4 flex-1 md:ml-6 md:mt-0">
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
            <div className="mt-6 flex flex-wrap items-start gap-8">
              {/* Newsletter Count */}
              <div className="flex min-w-[90px] flex-col items-center">
                <span className="text-3xl font-bold leading-none text-foreground">
                  {newsletterCount}
                </span>
                <span className="mt-1 text-base text-muted-foreground">
                  {newsletterCount === 1 ? "newsletter" : "newsletters"}
                </span>
              </div>

              {/* Follower Count */}
              <div className="flex min-w-[90px] flex-col items-center">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={followerCount}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.2, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-3xl font-bold leading-none text-foreground"
                  >
                    {followerCount}
                  </motion.span>
                </AnimatePresence>
                <span className="mt-1 text-base text-muted-foreground">
                  {followerCount === 1 ? "follower" : "followers"}
                </span>
              </div>

              {/* Follow Button */}
              <AnimatePresence mode="wait">
                {!hideFollowButton && !isOwnProfile && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="self-start"
                  >
                    <FollowButton
                      brandId={brandId}
                      initialIsFollowing={isFollowing}
                      onFollowChange={handleFollowChange}
                      className="px-6 py-2 text-base"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
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
