"use client";

import { useEffect, useState } from "react";

import { Tab, Tabs } from "@nextui-org/react";
import { BadgeCategory, Badge as BadgeType, BadgeType as BadgeTypeEnum } from "@prisma/client";

import { Badge } from "@/app/components/newsletters/badge";
import { NewsletterCard } from "@/app/components/newsletters/newsletter-card";

interface BadgeWithNewsletter extends BadgeType {
  newsletter: {
    newsletter_id: number;
    subject: string | null;
    sender: string | null;
    published_at: Date | null;
    html_file_url: string | null;
    full_screenshot_url: string | null;
    top_screenshot_url: string | null;
    likes_count: number | null;
    you_rocks_count: number | null;
    created_at: Date | null;
    user_id: string | null;
    brand_id: string | null;
    summary: string | null;
    products_link: string | null;
    updated_at: Date | null;
  };
}

export default function BadgesPage() {
  const [selectedType, setSelectedType] = useState<BadgeTypeEnum>("LIKE");
  const [selectedCategory, setSelectedCategory] = useState<BadgeCategory>("DAY");
  const [badges, setBadges] = useState<BadgeWithNewsletter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/badges?type=${selectedType}&category=${selectedCategory}`
        );
        if (response.ok) {
          const data = await response.json();
          setBadges(data);
        }
      } catch (error) {
        console.error("Error fetching badges:", error);
      }
      setIsLoading(false);
    };

    fetchBadges();
  }, [selectedType, selectedCategory]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Newsletter Awards</h1>

      <div className="mb-8 space-y-4">
        <Tabs
          selectedKey={selectedType}
          onSelectionChange={key => setSelectedType(key as BadgeTypeEnum)}
        >
          <Tab key="LIKE" title="Most Liked" />
          <Tab key="YOU_ROCK" title="Most You Rocks" />
        </Tabs>

        <Tabs
          selectedKey={selectedCategory}
          onSelectionChange={key => setSelectedCategory(key as BadgeCategory)}
        >
          <Tab key="DAY" title="Daily" />
          <Tab key="WEEK" title="Weekly" />
          <Tab key="MONTH" title="Monthly" />
        </Tabs>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {badges.map(badge => (
            <div key={badge.id} className="space-y-4">
              <Badge badge={badge} showDate size="lg" />
              <NewsletterCard newsletter={badge.newsletter} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
