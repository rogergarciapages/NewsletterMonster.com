import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";
import { getTopTags } from "@/lib/services/tag-service";
import type { TagWithNewsletters } from "@/types/newsletter";

import { TagSectionClient } from "./tag-section-client";

export const metadata = {
  title: "Newsletter Topics | Discover Newsletters by Category",
  description: "Explore our curated collection of newsletters across various topics...",
  keywords: "newsletter topics, email newsletters, newsletter categories, curated newsletters",
};

export default async function TagsLandingPage() {
  const topTags = await getTopTags();

  return (
    <ThreeColumnLayout>
      <div className="px-4 py-8 md:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-5xl">
            Discover Newsletters by Topic
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Explore our curated collection of newsletters across various topics...
          </p>
        </header>

        <div className="space-y-16">
          {topTags.map((tag: TagWithNewsletters) => (
            <TagSectionClient key={tag.id} tag={tag} />
          ))}
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
