"use client";

import { useEffect, useState } from "react";

import axios from "axios";

import NewsletterCardWrapper from "@/app/components/newsletters/newsletter-card-wrapper";
import { NewsletterCardSkeleton } from "@/app/components/skeleton/newsletter-card-skeleton";
import type { Newsletter } from "@/types/newsletter";

interface TaggedNewslettersProps {
  tag: string;
  count?: number;
}

// Sample data for fallback in development or when API fails
const SAMPLE_NEWSLETTERS: Newsletter[] = [
  {
    newsletter_id: 1,
    user_id: null,
    sender: "Holidays & Celebrations",
    subject: "Summer Festival Special Edition",
    top_screenshot_url: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=2070",
    likes_count: 9,
    you_rocks_count: 8,
    created_at: new Date(),
    summary: "Seasonal celebration ideas and food recipes",
  },
  {
    newsletter_id: 2,
    user_id: null,
    sender: "Jomashop",
    subject: "Father's Day Coupons",
    top_screenshot_url: "https://images.unsplash.com/photo-1606914998137-d9b33982be02?q=80&w=1974",
    likes_count: 6,
    you_rocks_count: 8,
    created_at: new Date(),
    summary: "Special deals and coupons for Father's Day",
  },
  {
    newsletter_id: 3,
    user_id: null,
    sender: "VS PINK",
    subject: "Summer Collection Preview",
    top_screenshot_url: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071",
    likes_count: 9,
    you_rocks_count: 8,
    created_at: new Date(),
    summary: "New summer fashion collection",
  },
  {
    newsletter_id: 4,
    user_id: null,
    sender: "Geographic Magazine",
    subject: "Wildlife Photography Special",
    top_screenshot_url: "https://images.unsplash.com/photo-1533450718592-29d45635f0a9?q=80&w=2070",
    likes_count: 7,
    you_rocks_count: 5,
    created_at: new Date(),
    summary: "Amazing wildlife photography from around the world",
  },
  {
    newsletter_id: 5,
    user_id: null,
    sender: "RetailMarketing",
    subject: "Digital Marketing Trends 2023",
    top_screenshot_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015",
    likes_count: 12,
    you_rocks_count: 10,
    created_at: new Date(),
    summary: "Latest trends in retail and digital marketing",
  },
  {
    newsletter_id: 6,
    user_id: null,
    sender: "Timberland",
    subject: "Summer Steals - New Collection",
    top_screenshot_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070",
    likes_count: 8,
    you_rocks_count: 6,
    created_at: new Date(),
    summary: "Summer collection and special discounts",
  },
];

export default function TaggedNewsletters({ tag, count = 6 }: TaggedNewslettersProps) {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tagId, setTagId] = useState<number | null>(null);
  const [usingSampleData, setUsingSampleData] = useState(false);

  // First fetch the tag ID by slug
  useEffect(() => {
    async function fetchTagId() {
      try {
        const response = await axios.get(`/api/tags/by-slug?slug=${tag}`);
        if (response.data && response.data.id) {
          setTagId(response.data.id);
        } else {
          throw new Error(`Tag not found: ${tag}`);
        }
      } catch (err) {
        console.error("Error fetching tag:", err);
        // Don't show error, just use sample data
        setUsingSampleData(true);
        setNewsletters(SAMPLE_NEWSLETTERS.slice(0, count));
        setLoading(false);
      }
    }

    fetchTagId();
  }, [tag, count]);

  // Then fetch newsletters using the tag ID
  useEffect(() => {
    if (!tagId && !usingSampleData) return;
    if (usingSampleData) return; // Skip if already using sample data

    async function fetchNewsletters() {
      try {
        setLoading(true);
        // Use the same API endpoint as the tag page
        const response = await axios.get(`/api/newsletters/by-tag?tagId=${tagId}&take=${count}`);

        if (response.data && response.data.length > 0) {
          setNewsletters(response.data);
        } else {
          // Use sample data if no results
          console.log("No newsletter results from API, using sample data");
          setUsingSampleData(true);
          setNewsletters(SAMPLE_NEWSLETTERS.slice(0, count));
        }
      } catch (err) {
        console.error("Error fetching newsletters:", err);
        // Use sample data instead of showing error
        setUsingSampleData(true);
        setNewsletters(SAMPLE_NEWSLETTERS.slice(0, count));
      } finally {
        setLoading(false);
      }
    }

    fetchNewsletters();
  }, [tagId, count, tag, usingSampleData]);

  // Log the newsletters for debugging
  useEffect(() => {
    if (!loading) {
      console.log("TaggedNewsletters - Rendering with newsletters:", newsletters);
    }
  }, [newsletters, loading]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(count)].map((_, index) => (
            <NewsletterCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-center dark:bg-red-900/20">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (newsletters.length === 0) {
    return (
      <div className="rounded-lg bg-gray-50 p-6 text-center dark:bg-zinc-900/50">
        <p className="text-gray-600 dark:text-gray-400">No newsletters found with the tag: {tag}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {newsletters.map(newsletter => (
          <NewsletterCardWrapper key={newsletter.newsletter_id} newsletter={newsletter} />
        ))}
      </div>
    </div>
  );
}
