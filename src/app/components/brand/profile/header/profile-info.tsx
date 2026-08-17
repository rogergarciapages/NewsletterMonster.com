// src/app/components/brand/profile/header/profile-info.tsx
"use client";

import { IconMapPin, IconRosetteDiscountCheckFilled } from "@tabler/icons-react";

import { BrandUser } from "../types";
import SocialLinks from "./social-links";
import Stats from "./stats";

interface ProfileInfoProps {
  brandName: string;
  user: BrandUser | null;
  newsletterCount: number;
  followersCount: number;
}

export default function ProfileInfo({
  brandName,
  user,
  newsletterCount,
  followersCount,
}: ProfileInfoProps) {
  // Check if brand is claimed
  const isClaimed = Boolean(user?.role === "BRAND");

  return (
    <div className="flex-grow">
      <div className="flex items-start gap-1">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-[#111] dark:text-white">
          {brandName}
        </h1>
        {isClaimed && (
          <div className="relative" style={{ top: "-8px" }}>
            <IconRosetteDiscountCheckFilled
              size={20}
              className="text-aquamarine-600 dark:text-aquamarine-500"
              stroke={1.5}
            />
          </div>
        )}
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
        {user?.username && (
          <span className="text-base text-gray-600 dark:text-gray-400">
            <span className="text-gray-400 dark:text-gray-500">@</span>
            {user.username}
          </span>
        )}
        {user?.location && (
          <div className="flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-400">
            <IconMapPin size={18} className="text-[#EA4335] shrink-0" />
            <span>{user.location}</span>
          </div>
        )}
      </div>

      <Stats newsletterCount={newsletterCount} followersCount={followersCount} />

      <div className="mb-4">
        <p className="text-sm text-gray-800 dark:text-gray-200">
          {user?.bio || "No info in your profile, yet."}
        </p>
      </div>

      <div className="mt-4">
        <SocialLinks user={user} />
      </div>
    </div>
  );
}
