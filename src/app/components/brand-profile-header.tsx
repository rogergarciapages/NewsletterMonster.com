"use client";

import { Button } from "@nextui-org/react";
import type { User } from "@prisma/client";
import {
    IconBrandInstagram,
    IconBrandLinkedin,
    IconBrandX,
    IconBrandXFilled,
    IconBrandYoutube,
    IconBrandYoutubeFilled,
    IconBriefcase,
    IconSquareCheckFilled,
    IconSquareRoundedPlusFilled,
    IconWorld,
    IconWorldUpload
} from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";

interface BrandProfileHeaderProps {
  brandName: string;
  user: User | null;
  newsletterCount: number;
  followersCount: number;
  isFollowing?: boolean;
  onFollow?: () => void;
  onClaimProfile?: () => void;
}

export default function BrandProfileHeader({
  brandName,
  user,
  newsletterCount,
  followersCount,
  isFollowing = false,
  onFollow,
  onClaimProfile,
}: BrandProfileHeaderProps) {
  const [isHoveringFollow, setIsHoveringFollow] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);


  return (
    <div className="p-8 border-b bg-white dark:bg-zinc-800 m-1 rounded-lg">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
          {/* Profile Image */}
          <div className="w-32 h-32 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden relative">
  {user?.profile_photo ? (
    <Image
      src={user.profile_photo}
      alt={`${user.name}'s profile`}
      fill
      className="object-cover"
      sizes="128px"
      priority
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
      <IconBriefcase size={72} />
    </div>
  )}
</div>

          {/* Profile Info */}
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <h1 className="text-4xl font-bold text-[#111] tracking-tight leading-tight dark:text-white">
                {brandName}
              </h1>
              <div className="flex gap-2">
                {user ? (
                  <Button
                    color={isFollowing ? "default" : "primary"}
                    variant={isFollowing ? "bordered" : "solid"}
                    size="sm"
                    onMouseEnter={() => setIsHoveringFollow(true)}
                    onMouseLeave={() => setIsHoveringFollow(false)}
                    onClick={onFollow}
                    startContent={
                      isFollowing ? 
                        <IconSquareCheckFilled size={20} /> : 
                        <IconSquareRoundedPlusFilled size={20} />
                    }
                  >
                    {isFollowing 
                      ? (isHoveringFollow ? "Unfollow" : "Following") 
                      : "Follow"}
                  </Button>
                ) : (
                  <Button
                    color="warning"
                    variant="solid"
                    size="sm"
                    onClick={onClaimProfile}
                  >
                    Claim Your Profile
                  </Button>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6 mb-4">
              <div>
                <span className="font-semibold text-gray-800 dark:text-white">
                  {newsletterCount}
                </span>
                <span className="text-gray-800 dark:text-white/90 ml-1">
                  newsletters
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-800 dark:text-white">
                  {followersCount}
                </span>
                <span className="text-gray-800 dark:text-white/90 ml-1">
                  followers
                </span>
              </div>
            </div>

            {/* Bio */}
            <div className="mb-4">
              <p className="text-sm text-gray-800 dark:text-white">
                {user?.bio || "No info in your profile, yet. Claim your profile today!"}
              </p>
            </div>

  {/* Social Links Section */}
  <div className="flex flex-wrap gap-4 text-gray-800 dark:text-white">
    <div className="flex items-center gap-1">
      <div 
        className="transition-colors" 
        onMouseEnter={() => setHoveredIcon("website")}
        onMouseLeave={() => setHoveredIcon(null)}
      >
        {hoveredIcon === "website" ? (
          <IconWorldUpload 
            size={20} 
            stroke={1.5} 
            className="text-torch-600"
          />
        ) : (
          <IconWorld 
            size={20} 
            stroke={1.5}
          />
        )}
      </div>
      <span className="text-sm">
        {user?.website ? (
          <a 
            href={user.website}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-torch-600 transition-colors"
            onMouseEnter={() => setHoveredIcon("website")}
            onMouseLeave={() => setHoveredIcon(null)}
          >
            Website
          </a>
        ) : "-"}
      </span>
    </div>

    <div className="flex items-center gap-1">
      <div 
        className="transition-colors"
        onMouseEnter={() => setHoveredIcon("twitter")}
        onMouseLeave={() => setHoveredIcon(null)}
      >
        {hoveredIcon === "twitter" ? (
          <IconBrandXFilled 
            size={20} 
            stroke={1.5} 
            className="text-[#1DA1F2]"
          />
        ) : (
          <IconBrandX 
            size={20} 
            stroke={1.5}
          />
        )}
      </div>
      <span className="text-sm">
        {user?.twitter_username ? (
          <a 
            href={`https://twitter.com/${user.twitter_username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#1DA1F2] transition-colors"
            onMouseEnter={() => setHoveredIcon("twitter")}
            onMouseLeave={() => setHoveredIcon(null)}
          >
            @{user.twitter_username}
          </a>
        ) : "-"}
      </span>
    </div>

    <div className="flex items-center gap-1">
      <div 
        className="transition-colors"
        onMouseEnter={() => setHoveredIcon("instagram")}
        onMouseLeave={() => setHoveredIcon(null)}
      >
        <IconBrandInstagram 
          size={20} 
          stroke={1.5}
          className={hoveredIcon === "instagram" ? "text-[#E4405F]" : ""}
        />
      </div>
      <span className="text-sm">
        {user?.instagram_username ? (
          <a 
            href={`https://instagram.com/${user.instagram_username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#E4405F] transition-colors"
            onMouseEnter={() => setHoveredIcon("instagram")}
            onMouseLeave={() => setHoveredIcon(null)}
          >
            @{user.instagram_username}
          </a>
        ) : "-"}
      </span>
    </div>

    <div className="flex items-center gap-1">
      <div 
        className="transition-colors"
        onMouseEnter={() => setHoveredIcon("linkedin")}
        onMouseLeave={() => setHoveredIcon(null)}
      >
        <IconBrandLinkedin 
          size={20} 
          stroke={1.5}
          className={hoveredIcon === "linkedin" ? "text-[#0A66C2]" : ""}
        />
      </div>
      <span className="text-sm">
        {user?.linkedin_profile ? (
          <a 
            href={user.linkedin_profile}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#0A66C2] transition-colors"
            onMouseEnter={() => setHoveredIcon("linkedin")}
            onMouseLeave={() => setHoveredIcon(null)}
          >
            LinkedIn
          </a>
        ) : "-"}
      </span>
    </div>

    <div className="flex items-center gap-1">
      <div 
        className="transition-colors"
        onMouseEnter={() => setHoveredIcon("youtube")}
        onMouseLeave={() => setHoveredIcon(null)}
      >
        {hoveredIcon === "youtube" ? (
          <IconBrandYoutubeFilled 
            size={20} 
            stroke={1.5} 
            className="text-[#FF0000]"
          />
        ) : (
          <IconBrandYoutube 
            size={20} 
            stroke={1.5}
          />
        )}
      </div>
      <span className="text-sm">
        {user?.youtube_channel ? (
          <a 
            href={user.youtube_channel}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#FF0000] transition-colors"
            onMouseEnter={() => setHoveredIcon("youtube")}
            onMouseLeave={() => setHoveredIcon(null)}
          >
            YouTube
          </a>
        ) : "-"}
      </span>
    </div>
  </div>
          </div>
        </div>
      </div>
    </div>
  );
}