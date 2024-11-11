import dynamic from "next/dynamic";
import Link from "next/link";
import { Suspense } from "react";

import { Chip } from "@nextui-org/chip";

import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";
// Make sure path matches your file structure
import type { Newsletter, TagWithNewsletters } from "@/types/newsletter";

import { getTopTags } from "../../lib/services/tags";
import { NewsletterCardSkeleton } from "../components/skeleton/newsletter-card-skeleton";

const NewsletterCard = dynamic(
  () => import("../components/newsletters/newsletter-card").then(mod => mod.NewsletterCard),
  {
    ssr: false,
    loading: () => <NewsletterCardSkeleton />,
  }
);

function NewsletterGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <NewsletterCardSkeleton key={i} />
      ))}
    </div>
  );
}

function NewsletterGrid({ newsletters }: { newsletters: Newsletter[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {newsletters.map(newsletter => (
        <div key={newsletter.newsletter_id}>
          <NewsletterCard newsletter={newsletter} />
        </div>
      ))}
    </div>
  );
}

function TagSection({ tag }: { tag: TagWithNewsletters }) {
  return (
    <section className="border-b border-gray-200 pb-12 last:border-0">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{tag.name}</h2>
        <Link href={`/tag/${tag.slug}`}>
          <Chip variant="solid" color="warning" className="cursor-pointer">
            {tag.count} Newsletters
          </Chip>
        </Link>
      </div>

      <Suspense fallback={<NewsletterGridSkeleton />}>
        <NewsletterGrid newsletters={tag.Newsletters.map(nt => nt.Newsletter)} />
      </Suspense>

      <div className="mt-6 text-center">
        <Link
          href={`/tag/${tag.slug}`}
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
  description:
    "Explore our curated collection of newsletters across various topics. Find insightful content that matches your interests.",
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
            Explore our curated collection of newsletters across various topics. Find insightful
            content that matches your interests and stay informed with the best newsletters in each
            category.
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
