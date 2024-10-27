"use client";

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
  return (
    <div className="flex-grow">
      <h1 className="text-4xl font-bold text-[#111] tracking-tight leading-tight dark:text-white">
        {brandName}
      </h1>

      <Stats 
        newsletterCount={newsletterCount}
        followersCount={followersCount}
      />

      <div className="mb-4">
        <p className="text-sm text-gray-800 dark:text-white">
          {user?.bio || "No info in your profile, yet."}
        </p>
      </div>

      {/* Always show social links section */}
      <div className="mt-4">
        <SocialLinks user={user} />
      </div>
    </div>
  );
}
