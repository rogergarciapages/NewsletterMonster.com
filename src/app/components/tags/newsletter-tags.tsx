"use client";

import Link from "next/dist/client/link";

// Fixed import
import { Chip } from "@nextui-org/chip";
import { IconTagFilled } from "@tabler/icons-react";

import { slugify } from "@/utils/slugify";

interface Tag {
  id: number;
  name: string;
  slug?: string;
}

interface NewsletterTag {
  Tag: Tag;
}

interface NewsletterTagsProps {
  tags: NewsletterTag[];
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "bordered" | "light";
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
}

export default function NewsletterTags({
  tags,
  className = "",
  size = "sm",
  variant = "solid",
  color = "warning",
}: NewsletterTagsProps) {
  if (!tags?.length) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map(({ Tag }) => (
        <Link
          key={Tag.id}
          href={`/tag/${Tag.slug || slugify(Tag.name)}`}
          className="transition-transform hover:scale-105"
        >
          <Chip
            variant={variant}
            color={color}
            size={size}
            startContent={<IconTagFilled size={12} />}
            className="cursor-pointer"
          >
            {Tag.name}
          </Chip>
        </Link>
      ))}
    </div>
  );
}
