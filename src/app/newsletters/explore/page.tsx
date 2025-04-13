import { Metadata } from "next";

import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";

import ExploreClient from "./explore-client";

export const metadata: Metadata = {
  title: "Explore Newsletters | NewsletterMonster",
  description: "Browse and discover newsletters from around the web, curated for you.",
  keywords: "newsletters, email newsletters, curated newsletters, discover newsletters",
  openGraph: {
    title: "Explore Newsletters | NewsletterMonster",
    description: "Browse and discover newsletters from around the web, curated for you.",
    type: "website",
    url: "https://newslettermonster.com/newsletters/explore",
    images: [
      {
        url: "/social-share-image.png",
        width: 1200,
        height: 630,
        alt: "NewsletterMonster - Explore Newsletters",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore Newsletters | NewsletterMonster",
    description: "Browse and discover newsletters from around the web, curated for you.",
  },
};

export default function ExplorePage() {
  return (
    <ThreeColumnLayout>
      <ExploreClient />
    </ThreeColumnLayout>
  );
}
