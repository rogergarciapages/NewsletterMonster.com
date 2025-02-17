"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import axios from "axios";

import { Card } from "@/components/ui/card";
import { TagWithNewsletters } from "@/types/newsletter";

import { TagSectionClient } from "./tag-section-client";

const TAGS_PER_PAGE = 10;

interface TagsClientProps {
  initialTags: TagWithNewsletters[];
}

export function TagsClient({ initialTags }: TagsClientProps) {
  const [tags, setTags] = useState<TagWithNewsletters[]>(initialTags);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observerRef = useRef<IntersectionObserver>();
  const processedTagIds = useRef(new Set(initialTags.map(tag => tag.id)));

  const fetchMoreTags = async (pageNumber: number) => {
    try {
      setLoading(true);
      const skip = pageNumber * TAGS_PER_PAGE;
      const response = await axios.get("/api/tags", {
        params: { skip, take: TAGS_PER_PAGE },
      });

      const newTags = response.data.filter(
        (tag: TagWithNewsletters) => !processedTagIds.current.has(tag.id)
      );

      newTags.forEach((tag: TagWithNewsletters) => {
        processedTagIds.current.add(tag.id);
      });

      if (newTags.length < TAGS_PER_PAGE) {
        setHasMore(false);
      }

      setTags(prev => [...prev, ...newTags]);
    } catch (error) {
      console.error("Error fetching tags:", error);
    } finally {
      setLoading(false);
    }
  };

  const lastTagCallback = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prev => prev + 1);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    if (page > 1) {
      fetchMoreTags(page);
    }
  }, [page]);

  return (
    <div className="space-y-16">
      {tags.map((tag, index) => (
        <div key={tag.id} ref={index === tags.length - 1 ? lastTagCallback : null}>
          <TagSectionClient tag={tag} />
        </div>
      ))}

      {loading && (
        <Card className="p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        </Card>
      )}

      {!hasMore && tags.length > 0 && (
        <div className="col-span-3 p-8 text-center text-gray-600">
          You&apos;ve seen all available tags 🎉
        </div>
      )}
    </div>
  );
}
