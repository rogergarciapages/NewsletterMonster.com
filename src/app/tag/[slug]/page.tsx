import { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";
import { getTagBySlug } from "@/lib/services/tags";
import { baseUrl } from "@/lib/utils";
import { Tag, isValidTag } from "@/types/tag";

import TagNewslettersClient from "./tag-newsletters-client";

interface TagPageProps {
  params: {
    slug: string;
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const tag = await getTagBySlug(params.slug);

  if (!tag || !isValidTag(tag)) return notFound();

  const tagName = tag.name.toLowerCase();
  const title = `${tag.name} Newsletters | Best ${tagName} Email Newsletters | NewsletterMonster`;
  const description = `Discover the best ${tag.name} newsletters. Browse our curated collection of ${tag.count}+ popular ${tagName} newsletters, reviews, and recommendations.`;

  return {
    title,
    description,
    keywords: `${tag.name} newsletters, ${tagName} email newsletters, best ${tagName} newsletters, top ${tagName} newsletters, curated ${tagName} newsletters`,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://newslettermonster.com/tag/${params.slug}`,
      images: [
        {
          url: "/social-share-image.png",
          width: 1200,
          height: 630,
          alt: `Best ${tag.name} Newsletters`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `https://newslettermonster.com/tag/${params.slug}`,
    },
  };
}

function generateSchema(tag: Tag) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${baseUrl}/tag/${tag.slug}#webpage`,
    name: `${tag.name} Newsletters Collection`,
    description: `Curated collection of ${tag.count}+ ${tag.name.toLowerCase()} newsletters and email subscriptions`,
    url: `${baseUrl}/tag/${tag.slug}`,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      name: "NewsletterMonster",
      url: baseUrl,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@id": baseUrl,
            name: "Home",
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@id": `${baseUrl}/tag/${tag.slug}`,
            name: `${tag.name} Newsletters`,
          },
        },
      ],
    },
    about: {
      "@type": "Thing",
      name: tag.name,
      description: `Email newsletters about ${tag.name.toLowerCase()}`,
    },
    numberOfItems: tag.count,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: tag.count,
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      name: `${tag.name} Newsletters List`,
    },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const tag = await getTagBySlug(params.slug);

  if (!tag || !isValidTag(tag)) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateSchema(tag)),
        }}
      />
      <ThreeColumnLayout>
        <TagNewslettersClient tag={tag} />
      </ThreeColumnLayout>
    </>
  );
}
