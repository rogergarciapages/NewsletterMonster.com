// src/app/components/brand/seo/brand-page-seo.tsx
import { Metadata } from "next";

import { Organization, Person, WithContext } from "schema-dts";

import { Newsletter } from "../newsletter/types";
import { BrandUser } from "../profile/types";

interface BrandSEOProps {
  brandname: string;
  displayName: string;
  newsletters: Newsletter[];
  user: BrandUser;
  followersCount: number;
}

export function generateBrandMetadata({
  brandname,
  displayName,
  newsletters,
  user,
  followersCount,
}: BrandSEOProps): Metadata {
  const description =
    user?.bio ||
    `Check out ${displayName}'s newsletters on Newsletter Monster. ${newsletters.length} newsletters published, ${followersCount} followers.`;

  return {
    title: `${displayName} Newsletters | Newsletter Monster`,
    description,
    openGraph: {
      title: `${displayName} - Newsletter Archive`,
      description,
      type: "profile",
      images: user?.profile_photo
        ? [
            {
              url: user.profile_photo,
              width: 400,
              height: 400,
              alt: `${displayName}'s profile photo`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${displayName} Newsletters`,
      description,
      creator: user?.twitter_username ? `@${user.twitter_username}` : undefined,
    },
    alternates: {
      canonical: `/${brandname}`,
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  };
}

export function generateBrandJsonLd({
  brandname,
  displayName,
  user,
  newsletters,
}: BrandSEOProps): WithContext<Organization | Person> {
  const baseUrl = `https://newslettermonster.com/${brandname}`;

  if (user) {
    return {
      "@context": "https://schema.org",
      "@type": "Person",
      name: user.name,
      description: user.bio || undefined,
      url: user.website || baseUrl,
      image: user.profile_photo || undefined,
      sameAs: [
        user.twitter_username && `https://twitter.com/${user.twitter_username}`,
        user.linkedin_profile,
        user.instagram_username && `https://instagram.com/${user.instagram_username}`,
        user.youtube_channel,
      ].filter(Boolean) as string[],
      worksFor: user.company_name
        ? {
            "@type": "Organization",
            name: user.company_name,
          }
        : undefined,
      memberOf: {
        "@type": "Organization",
        name: "NewsletterMonster",
        url: "https://newslettermonster.com",
      },
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: displayName,
    url: baseUrl,
    "@id": baseUrl,
    subOrganization: {
      "@type": "Organization",
      name: "NewsletterMonster",
      url: "https://newslettermonster.com",
    },
    makesOffer: newsletters.map(newsletter => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Article",
        "@id": `${baseUrl}/newsletter/${newsletter.newsletter_id}`,
        headline: newsletter.subject || "",
        datePublished: newsletter.created_at?.toISOString(),
        description: newsletter.summary || "",
        image: newsletter.top_screenshot_url || "",
        publisher: {
          "@type": "Organization",
          name: displayName,
          "@id": baseUrl,
        },
      },
    })),
  };
}

export function BrandStructuredData(props: BrandSEOProps) {
  const jsonLd = generateBrandJsonLd(props);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      key="brand-jsonld"
    />
  );
}
