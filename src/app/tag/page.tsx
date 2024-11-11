import Link from "next/link";

import { Chip } from "@nextui-org/chip";

import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";
import type { TagWithNewsletters } from "@/types/newsletter";

import { getTopTags } from "../../lib/services/tags";
import { NewsletterGrid } from "../components/tags/tag-grid";

function TagSection({ tag }: { tag: TagWithNewsletters }) {
  return (
    <section className="border-b border-gray-200 pb-12 last:border-0">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{tag.name}</h2>
        <Link href={`/tag/${encodeURIComponent(tag.slug)}`}>
          <Chip variant="solid" color="warning" className="cursor-pointer">
            {tag.count} Newsletters
          </Chip>
        </Link>
      </div>

      <NewsletterGrid newsletters={tag.Newsletters.map(nt => nt.Newsletter)} />

      <div className="mt-6 text-center">
        <Link
          href={`/tag/${encodeURIComponent(tag.slug)}`}
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          View all {tag.count} newsletters in {tag.name} →
        </Link>
      </div>
    </section>
  );
}

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
          {topTags.map(tag => (
            <TagSection key={tag.id} tag={tag} />
          ))}
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
