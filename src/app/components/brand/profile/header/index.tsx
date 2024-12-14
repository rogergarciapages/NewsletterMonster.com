// src/app/components/brand/profile/header/index.tsx
"use client";

import Image from "next/image";

import { Brand, SocialLinks } from "@prisma/client";
import { FaGithub, FaInstagram, FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa";

import FollowButton from "./follow-button";

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
  followersCount,
  isFollowing,
  hideFollowButton = false,
  isOwnProfile = false,
}: BrandProfileHeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center">
              {brand.logo ? (
                <Image
                  className="h-16 w-16 rounded-full"
                  src={brand.logo}
                  alt={`${brandName} logo`}
                  width={64}
                  height={64}
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
                  <span className="text-2xl font-semibold text-gray-600">
                    {brandName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="ml-4">
                <h1 className="truncate text-2xl font-bold leading-7 text-gray-900 sm:leading-9">
                  {brandName}
                </h1>
                {brand.description && (
                  <p className="mt-1 text-sm text-gray-500">{brand.description}</p>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-medium text-gray-900">{newsletterCount}</span>
                    <span className="ml-1">newsletters</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-medium text-gray-900">{followersCount}</span>
                    <span className="ml-1">followers</span>
                  </div>
                  {brand.website && (
                    <a
                      href={brand.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {new URL(brand.website).hostname}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex space-x-3 md:ml-4 md:mt-0">
            {!hideFollowButton && !isOwnProfile && (
              <FollowButton brandId={brandId} brandName={brandName} isFollowing={isFollowing} />
            )}
          </div>
        </div>
        {brand.social_links && (
          <div className="mt-4 flex space-x-4">
            {brand.social_links.twitter && (
              <a
                href={`https://twitter.com/${brand.social_links.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-500"
              >
                <FaTwitter className="h-5 w-5" />
              </a>
            )}
            {brand.social_links.instagram && (
              <a
                href={`https://instagram.com/${brand.social_links.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-500"
              >
                <FaInstagram className="h-5 w-5" />
              </a>
            )}
            {brand.social_links.linkedin && (
              <a
                href={brand.social_links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-500"
              >
                <FaLinkedin className="h-5 w-5" />
              </a>
            )}
            {brand.social_links.youtube && (
              <a
                href={brand.social_links.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-500"
              >
                <FaYoutube className="h-5 w-5" />
              </a>
            )}
            {brand.social_links.github && (
              <a
                href={`https://github.com/${brand.social_links.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-500"
              >
                <FaGithub className="h-5 w-5" />
              </a>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
