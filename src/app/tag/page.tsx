import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";
import { getTopTagsWithNewsletters } from "@/lib/services/tags";

import { TagsClient } from "./tags-client";

export const metadata = {
  title: "Newsletter Topics | Discover Newsletters by Category",
  description: "Explore our curated collection of newsletters across various topics...",
  keywords: "newsletter topics, email newsletters, newsletter categories, curated newsletters",
};

export default async function TagsLandingPage() {
  // Get initial tags
  const initialTags = await getTopTagsWithNewsletters(0, 10); // First 10 tags

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

        <TagsClient initialTags={initialTags} />
      </div>
    </ThreeColumnLayout>
  );
}
