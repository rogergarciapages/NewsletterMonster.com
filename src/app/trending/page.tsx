// src/app/trending/page.tsx
import { Metadata } from "next";

import TrendingNewslettersClient from "./trending-newsletters-client";

export const metadata: Metadata = {
  title: "Trending Newsletters | Most Popular Email Newsletters | NewsletterMonster",
  description: "Discover the most popular and trending email newsletters.",
  keywords:
    "trending newsletters, popular newsletters, best newsletters, email newsletters, newsletter trends, top newsletters",
  openGraph: {
    title: "Trending Newsletters | NewsletterMonster",
    description: "Discover the most popular and trending email newsletters on NewsletterMonster.",
    type: "website",
    siteName: "NewsletterMonster",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trending Newsletters | NewsletterMonster",
    description: "Discover the most popular and trending email newsletters on NewsletterMonster.",
  },
  alternates: {
    canonical: "https://newslettermonster.com/trending",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

export default function TrendingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": "https://newslettermonster.com/trending#webpage",
            name: "Trending Newsletters",
            description:
              "Discover the most popular and trending email newsletters on NewsletterMonster.",
            url: "https://newslettermonster.com/trending",
            isPartOf: {
              "@type": "WebSite",
              "@id": "https://newslettermonster.com/#website",
              name: "NewsletterMonster",
              url: "https://newslettermonster.com",
            },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  item: {
                    "@id": "https://newslettermonster.com/",
                    name: "Home",
                  },
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  item: {
                    "@id": "https://newslettermonster.com/trending",
                    name: "Trending Newsletters",
                  },
                },
              ],
            },
          }),
        }}
      />

      <TrendingNewslettersClient />
    </>
  );
}
