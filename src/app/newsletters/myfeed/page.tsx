import { Metadata } from "next";

import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";

import MyFeedClient from "./myfeed-client";

export const metadata: Metadata = {
  title: "My Feed | Newsletters from Brands You Follow | NewsletterMonster",
  description: "View the latest newsletters from brands you follow in your personalized feed.",
  keywords: "newsletter feed, curated feed, newsletters, followed brands, personalized content",
  openGraph: {
    title: "My Feed | NewsletterMonster",
    description: "View the latest newsletters from brands you follow in your personalized feed.",
    type: "website",
    siteName: "NewsletterMonster",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Feed | NewsletterMonster",
    description: "View the latest newsletters from brands you follow in your personalized feed.",
  },
  alternates: {
    canonical: "https://newslettermonster.com/newsletters/myfeed",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

export default function MyFeedPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": "https://newslettermonster.com/newsletters/myfeed#webpage",
            name: "My Feed",
            description:
              "View the latest newsletters from brands you follow in your personalized feed.",
            url: "https://newslettermonster.com/newsletters/myfeed",
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
                    "@id": "https://newslettermonster.com/newsletters/myfeed",
                    name: "My Feed",
                  },
                },
              ],
            },
          }),
        }}
      />

      <ThreeColumnLayout>
        <MyFeedClient />
      </ThreeColumnLayout>
    </>
  );
}
