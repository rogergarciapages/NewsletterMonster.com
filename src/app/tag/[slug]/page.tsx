import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getTagBySlug } from "@/lib/services/tags";
import { isValidTag } from "@/types/tag";

import TagNewslettersClient from "./tag-newsletters-client";

interface TagPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const tag = await getTagBySlug(params.slug);

  if (!tag || !isValidTag(tag)) return notFound();

  const title = `${tag.name} Newsletters | Newsletter Archive`;
  const description = `Discover the best ${tag.name} newsletters. Browse our collection of ${tag.count}+ curated ${tag.name.toLowerCase()} newsletters.`;

  return {
    title,
    description,
    keywords: `${tag.name} newsletters, ${tag.name.toLowerCase()} email newsletters, best ${tag.name.toLowerCase()} newsletters`,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const tag = await getTagBySlug(params.slug);

  if (!tag || !isValidTag(tag)) notFound();

  return <TagNewslettersClient tag={tag} />;
}
