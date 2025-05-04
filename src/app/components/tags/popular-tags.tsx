"use client";

import NextLink from "next/dist/client/link";

import { Button, Chip } from "@nextui-org/react";
import useSWR from "swr";

import PopularTagsLoading from "./popular-tags-loading";

interface Tag {
  id: number;
  name: string;
  slug: string;
  count: number;
}

const FALLBACK_TAGS: Tag[] = [
  { id: 1, name: "Technology", slug: "technology", count: 100 },
  { id: 2, name: "Business", slug: "business", count: 80 },
  { id: 3, name: "Marketing", slug: "marketing", count: 75 },
  { id: 4, name: "Design", slug: "design", count: 60 },
  { id: 5, name: "Finance", slug: "finance", count: 55 },
  { id: 6, name: "Startups", slug: "startups", count: 50 },
  { id: 7, name: "AI", slug: "ai", count: 45 },
];

function truncateTag(name: string, maxLength: number = 12): string {
  return name.length > maxLength ? `${name.slice(0, maxLength)}...` : name;
}

function getRandomTags(tags: Tag[], count: number = 12): Tag[] {
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
    fallbackData: FALLBACK_TAGS, // Use fallback data when loading or on error
  });

  if (isLoading) {
    return <PopularTagsLoading />;
  }

  // Use fallback tags if there's an error or no tags
  const tagsToUse = !tags || tags.length === 0 || error ? FALLBACK_TAGS : tags;
  const randomTags = getRandomTags(tagsToUse);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-1.5">
        {randomTags.map(tag => (
          <NextLink
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
          </NextLink>
        ))}
      </div>
      <div className="mt-2 text-center"></div>
      <NextLink href="/tag" className="w-full">
        <Button color="success" variant="ghost" size="sm" className="w-full">
          Browse all tags
        </Button>
      </NextLink>
    </div>
  );
}
