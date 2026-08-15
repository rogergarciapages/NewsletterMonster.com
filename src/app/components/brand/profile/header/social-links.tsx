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

  if (!user) return null;

  const links = [
    {
      type: "website",
      url: user.website || null,
      display: user.website ? user.website.replace(/^https?:\/\//, "").replace(/\/$/, "") : null,
      icon: hoveredIcon === "website" ? <IconWorldUpload size={20} stroke={1.5} /> : <IconWorld size={20} stroke={1.5} />,
    },
    {
      type: "twitter",
      url: user.twitter_username ? (user.twitter_username.startsWith("http") ? user.twitter_username : `https://twitter.com/${user.twitter_username.replace(/^@/, "")}`) : null,
      display: user.twitter_username ? (user.twitter_username.startsWith("@") ? user.twitter_username : `@${user.twitter_username}`) : null,
      icon: hoveredIcon === "twitter" ? <IconBrandXFilled size={20} stroke={1.5} /> : <IconBrandX size={20} stroke={1.5} />,
    },
    {
      type: "instagram",
      url: user.instagram_username ? (user.instagram_username.startsWith("http") ? user.instagram_username : `https://instagram.com/${user.instagram_username.replace(/^@/, "")}`) : null,
      display: user.instagram_username ? (user.instagram_username.startsWith("@") ? user.instagram_username : `@${user.instagram_username}`) : null,
      icon: <IconBrandInstagram size={20} stroke={1.5} className={hoveredIcon === "instagram" ? "text-[#E4405F]" : ""} />,
    },
    {
      type: "linkedin",
      url: user.linkedin_profile || null,
      display: "LinkedIn",
      icon: <IconBrandLinkedin size={20} stroke={1.5} className={hoveredIcon === "linkedin" ? "text-[#0A66C2]" : ""} />,
    },
    {
      type: "youtube",
      url: user.youtube_channel || null,
      display: "YouTube",
      icon: hoveredIcon === "youtube" ? <IconBrandYoutubeFilled size={20} stroke={1.5} /> : <IconBrandYoutube size={20} stroke={1.5} />,
    },
  ].filter(link => Boolean(link.url && link.url.trim() !== ""));

  if (links.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-4 text-gray-800 dark:text-white">
      {links.map((link) => (
        <SocialLink
          key={link.type}
          type={link.type}
          url={link.url}
          display={link.display}
          icon={link.icon}
          isHovered={hoveredIcon === link.type}
          onHover={() => setHoveredIcon(link.type)}
          onLeave={() => setHoveredIcon(null)}
        />
      ))}
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
  if (!url) return null;

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
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-1.5 hover:${getHoverColor(type)} transition-colors`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div>{icon}</div>
      <span className="text-sm font-medium">
        {display || type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    </a>
  );
}