"use client";

import { Button } from "@nextui-org/react";
import {
    IconBrandInstagram,
    IconBrandLinkedin,
    IconBrandX,
    IconBrandXFilled,
    IconBrandYoutube,
    IconBrandYoutubeFilled,
    IconBriefcase,
    IconWorld,
    IconWorldUpload
} from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";
import FollowButton from "./follow-button";

interface BrandUser {
  user_id: string;
  name: string;
  surname: string | null;
  company_name: string | null;
  username: string | null;
  email: string;
  profile_photo: string | null;
  bio: string | null;
  website: string | null;
  twitter_username: string | null;
  instagram_username: string | null;
  youtube_channel: string | null;
  linkedin_profile: string | null;
  role: string | null;
}

interface BrandProfileHeaderProps {
  brandName: string;
  user: BrandUser | null;
  newsletterCount: number;
  followersCount: number;
  isFollowing?: boolean;
  onFollow?: () => void;
  onClaimProfile?: () => void;
  onFollowChange?: (count: number) => void;
}

interface SocialLinkProps {
    type: string;
    url?: string | null;
    display?: string | null;
    icon: React.ReactNode;
    onHover: () => void;
    onLeave: () => void;
  }
  
  function SocialLink({ type, url, display, icon, onHover, onLeave }: SocialLinkProps) {
  const getHoverColor = (type: string) => {
    switch (type) {
      case "twitter": return "text-[#1DA1F2]";
      case "instagram": return "text-[#E4405F]";
      case "linkedin": return "text-[#0A66C2]";
      case "youtube": return "text-[#FF0000]";
      case "website": return "text-torch-600";
      default: return "";
    }
  };

  return (
    <div className="flex items-center gap-1">
      <div 
        className="transition-colors"
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        {icon}
      </div>
      <span className="text-sm">
        {url ? (
          <a 
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`hover:${getHoverColor(type)} transition-colors`}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
          >
            {display || type.charAt(0).toUpperCase() + type.slice(1)}
          </a>
        ) : "-"}
      </span>
    </div>
  );
}

export default function BrandProfileHeader({
    brandName,
    user,
    newsletterCount,
    followersCount,
    isFollowing = false,
    onFollow,
    onClaimProfile,
    onFollowChange,
  }: BrandProfileHeaderProps) {
    const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
    const [localFollowersCount, setLocalFollowersCount] = useState(followersCount);

  return (
    <div className="p-8 border-b bg-white dark:bg-zinc-800 m-1 rounded-lg">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
          <div className="flex flex-col items-center gap-4">
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
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 dark:bg-zinc-700 dark:text-gray-500">
                  <IconBriefcase size={72} />
                </div>
              )}
            </div>
            
            {/* Follow Button */}
            {user && (
              <FollowButton 
                brandId={user.user_id}
                initialIsFollowing={isFollowing}
                onFollowStateChange={(newState) => {
                  const newCount = newState ? localFollowersCount + 1 : localFollowersCount - 1;
                  setLocalFollowersCount(newCount);
                  onFollowChange?.(newCount);
                  if (onFollow) onFollow();
                }}
              />
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <h1 className="text-4xl font-bold text-[#111] tracking-tight leading-tight dark:text-white">
                {brandName}
              </h1>
              <div className="flex gap-2">
                {!user && (
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
                  {localFollowersCount}
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

            {/* Social Links */}
            <div className="flex flex-wrap gap-4 text-gray-800 dark:text-white">
              <SocialLink
                type="website"
                url={user?.website || null}
                icon={hoveredIcon === "website" ? <IconWorldUpload size={20} stroke={1.5} /> : <IconWorld size={20} stroke={1.5} />}
                isHovered={hoveredIcon === "website"}
                onHover={() => setHoveredIcon("website")}
                onLeave={() => setHoveredIcon(null)}
              />

              <SocialLink
                type="twitter"
                url={user?.twitter_username ? `https://twitter.com/${user.twitter_username}` : null}
                display={user?.twitter_username ? `@${user.twitter_username}` : null}
                icon={hoveredIcon === "twitter" ? <IconBrandXFilled size={20} stroke={1.5} /> : <IconBrandX size={20} stroke={1.5} />}
                isHovered={hoveredIcon === "twitter"}
                onHover={() => setHoveredIcon("twitter")}
                onLeave={() => setHoveredIcon(null)}
              />

              <SocialLink
                type="instagram"
                url={user?.instagram_username ? `https://instagram.com/${user.instagram_username}` : null}
                display={user?.instagram_username ? `@${user.instagram_username}` : null}
                icon={<IconBrandInstagram size={20} stroke={1.5} className={hoveredIcon === "instagram" ? "text-[#E4405F]" : ""} />}
                isHovered={hoveredIcon === "instagram"}
                onHover={() => setHoveredIcon("instagram")}
                onLeave={() => setHoveredIcon(null)}
              />

              <SocialLink
                type="linkedin"
                url={user?.linkedin_profile || null}
                icon={<IconBrandLinkedin size={20} stroke={1.5} className={hoveredIcon === "linkedin" ? "text-[#0A66C2]" : ""} />}
                isHovered={hoveredIcon === "linkedin"}
                onHover={() => setHoveredIcon("linkedin")}
                onLeave={() => setHoveredIcon(null)}
              />

              <SocialLink
                type="youtube"
                url={user?.youtube_channel || null}
                icon={hoveredIcon === "youtube" ? 
                  <IconBrandYoutubeFilled size={20} stroke={1.5} /> : 
                  <IconBrandYoutube size={20} stroke={1.5} />}
                isHovered={hoveredIcon === "youtube"}
                onHover={() => setHoveredIcon("youtube")}
                onLeave={() => setHoveredIcon(null)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}