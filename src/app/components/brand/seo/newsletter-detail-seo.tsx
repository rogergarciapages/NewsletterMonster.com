// src/app/components/brand/seo/newsletter-detail-seo.tsx
import { Metadata } from "next";

import { Article, BreadcrumbList, WithContext } from "schema-dts";

// Define the complete NewsletterDetail type
interface NewsletterDetail {
  newsletter_id: number;
  user_id: string | null;
  sender: string | null;
  published_at: Date | null;
  subject: string | null;
  html_file_url: string | null;
  full_screenshot_url: string | null;
  top_screenshot_url: string | null;
  likes_count: number | null;
  you_rocks_count: number | null;
  created_at: Date | null;
  products_link: string | null;
  summary: string | null;
  NewsletterTag: {
    Tag: {
      id: number;
      name: string;
    };
  }[];
}

interface NewsletterSEOProps {
  newsletter: NewsletterDetail;
  brandname: string;
  brandDisplayName: string;
  currentUrl: string;
}

export function generateNewsletterMetadata({
  newsletter,
  brandDisplayName,
  currentUrl,
}: NewsletterSEOProps): Metadata {
  const title = `${newsletter.subject || "Newsletter"} by ${brandDisplayName}`;
  const description =
    newsletter.summary ||
    `Read the latest newsletter from ${brandDisplayName}${newsletter.created_at ? `, sent on ${newsletter.created_at.toLocaleDateString()}` : ""}. Includes industry insights and updates.`;

  // Generate keywords based on content
  const keywords = [
    newsletter.subject,
    brandDisplayName,
    "email newsletter",
    ...(newsletter.NewsletterTag?.map(({ Tag }) => Tag.name) || []),
  ]
    .filter(Boolean)
    .join(", ");

  return {
    title,
    description,
    keywords,
    authors: [{ name: brandDisplayName }],
    openGraph: {
      title,
      description,
      type: "article",
      url: currentUrl,
      siteName: "NewsletterMonster",
      publishedTime: newsletter.created_at?.toISOString(),
      modifiedTime: newsletter.created_at?.toISOString(),
      images: newsletter.top_screenshot_url
        ? [
            {
              url: newsletter.top_screenshot_url,
              width: 1200,
              height: 630,
              alt: `Newsletter preview: ${newsletter.subject}`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: newsletter.top_screenshot_url ? [newsletter.top_screenshot_url] : undefined,
    },
    alternates: {
      canonical: currentUrl,
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  };
}

export function generateNewsletterJsonLd({
  newsletter,
  brandname,
  brandDisplayName,
  currentUrl,
}: NewsletterSEOProps): Array<WithContext<Article> | WithContext<BreadcrumbList>> {
  const baseUrl = "https://newslettermonster.com";
  const brandUrl = `${baseUrl}/${brandname}`;

  // Article schema
  const articleSchema: WithContext<Article> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: newsletter.subject || "Newsletter",
    description: newsletter.summary || "",
    datePublished: newsletter.created_at?.toISOString(),
    dateModified: newsletter.created_at?.toISOString(),
    image: newsletter.top_screenshot_url || undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": currentUrl,
    },
    author: {
      "@type": "Organization",
      name: brandDisplayName,
      url: brandUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "NewsletterMonster",
      url: baseUrl,
    },
    keywords: newsletter.NewsletterTag?.map(({ Tag }) => Tag.name).join(", ") || "",
    articleBody: newsletter.summary || "",
    isAccessibleForFree: true,
  };

  // Separate breadcrumb schema
  const breadcrumbSchema: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
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
          "@id": brandUrl,
          name: brandDisplayName,
        },
      },
      {
        "@type": "ListItem",
        position: 3,
        item: {
          "@id": currentUrl,
          name: newsletter.subject || "Newsletter",
        },
      },
    ],
  };

  return [articleSchema, breadcrumbSchema];
}

export function NewsletterStructuredData(props: NewsletterSEOProps) {
  const jsonLdArray = generateNewsletterJsonLd(props);

  return (
    <>
      {jsonLdArray.map((jsonLd, index) => (
        <script
          key={`structured-data-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ))}
    </>
  );
}
