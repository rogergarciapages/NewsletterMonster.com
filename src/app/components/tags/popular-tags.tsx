"use client";

import Link from "next/link";

import { Button, Chip } from "@nextui-org/react";
import useSWR from "swr";

import PopularTagsLoading from "./popular-tags-loading";

interface Tag {
  id: number;
  name: string;
  slug: string;
  count: number;
}

function truncateTag(name: string, maxLength: number = 12): string {
  return name.length > maxLength ? `${name.slice(0, maxLength)}...` : name;
}

function getRandomTags(tags: Tag[], count: number = 7): Tag[] {
  const shuffled = [...tags].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function PopularTags() {
  const {
    data: tags,
    error,
    isLoading,
  } = useSWR<Tag[]>("/api/tags/popular", {
    revalidateOnMount: true,
    dedupingInterval: 60000, // Cache for 1 minute
  });

  if (isLoading) {
    return <PopularTagsLoading />;
  }

  if (error) {
    console.error("Error loading tags:", error);
    return null;
  }

  if (!tags || tags.length === 0) {
    return null;
  }

  const randomTags = getRandomTags(tags);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-1.5">
        {randomTags.map(tag => (
          <Link
            key={tag.id}
            href={`/tag/${tag.slug}`}
            className="transition-transform hover:scale-105"
          >
            <Chip
              variant="solid"
              color="warning"
              radius="full"
              classNames={{
                base: "cursor-pointer text-xs max-w-full",
                content: "font-xs truncate",
              }}
              title={tag.name}
            >
              {truncateTag(tag.name)}
            </Chip>
          </Link>
        ))}
      </div>
      <div className="mt-2 text-center"></div>
      <Link href="/tag" className="w-full">
        <Button color="success" variant="ghost" size="sm" className="w-full">
          Browse all tags
        </Button>
      </Link>
    </div>
  );
}
