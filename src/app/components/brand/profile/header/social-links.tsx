// src/app/components/brand/profile/header/social-links.tsx
"use client";

import {
    IconBrandInstagram,
    IconBrandLinkedin,
    IconBrandX,
    IconBrandXFilled,
    IconBrandYoutube,
    IconBrandYoutubeFilled,
    IconWorld,
    IconWorldUpload,
} from "@tabler/icons-react";
import { useState } from "react";
import { BrandUser } from "../types";

interface SocialLinksProps {
  user: BrandUser | null;
}

export default function SocialLinks({ user }: SocialLinksProps) {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  // Show placeholder links if no user
  return (
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
  );
}

interface SocialLinkProps {
  type: string;
  url: string | null;
  display?: string | null;
  icon: React.ReactNode;
  isHovered: boolean;
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