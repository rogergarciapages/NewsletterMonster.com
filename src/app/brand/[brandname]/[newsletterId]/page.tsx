// app/[brandname]/[newsletterId]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";

import { getServerSession } from "next-auth";

import EmailContent from "@/app/components/brand/newsletter/email-content";
import EmailHeader from "@/app/components/brand/newsletter/email-header";
import EmailToolbar from "@/app/components/brand/newsletter/email-toolbar";
import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";
import { BookmarkButton } from "@/app/components/newsletters/bookmark-button";
import { LikeButton } from "@/app/components/newsletters/like-button";
import { YouRockButton } from "@/app/components/newsletters/you-rock-button";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { isNewsletterBookmarked } from "@/lib/services/bookmark";

import {
  NewsletterStructuredData,
  generateNewsletterMetadata,
} from "../../../components/brand/seo/newsletter-detail-seo";

// Type definitions
type NewsletterDetail = {
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
  badges: {
    id: string;
    type: BadgeType;
    category: BadgeCategory;
    rank: BadgeRank;
    earned_at: Date;
    count: number;
  }[];
  NewsletterTag: {
    Tag: {
      id: number;
      name: string;
    };
  }[];
};

// Add enum types from Prisma schema
enum BadgeType {
  LIKE = "LIKE",
  YOU_ROCK = "YOU_ROCK",
}

enum BadgeCategory {
  DAY = "DAY",
  WEEK = "WEEK",
  MONTH = "MONTH",
}

enum BadgeRank {
  FIRST = "FIRST",
  SECOND = "SECOND",
  THIRD = "THIRD",
}

// Helper function to format brand name
function formatBrandName(brandname: string): string {
  return brandname
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Check if a newsletter is liked by a user
async function checkIsNewsletterLiked(userId: string, newsletterId: number): Promise<boolean> {
  const like = await prisma.like.findFirst({
    where: {
      user_id: userId,
      newsletter_id: newsletterId,
    },
  });

  return !!like;
}

// Data fetching function
async function getNewsletter(newsletterId: string): Promise<NewsletterDetail | null> {
  if (!newsletterId || isNaN(Number(newsletterId))) {
    console.error("Invalid newsletter ID:", newsletterId);
    return null;
  }

  try {
    const newsletter = await prisma.newsletter.findUnique({
      where: {
        newsletter_id: parseInt(newsletterId),
      },
      select: {
        newsletter_id: true,
        user_id: true,
        sender: true,
        published_at: true,
        subject: true,
        html_file_url: true,
        full_screenshot_url: true,
        top_screenshot_url: true,
        likes_count: true,
        you_rocks_count: true,
        created_at: true,
        products_link: true,
        summary: true,
        badges: {
          select: {
            id: true,
            type: true,
            category: true,
            rank: true,
            earned_at: true,
            count: true,
          },
          orderBy: {
            earned_at: "desc",
          },
        },
        NewsletterTag: {
          select: {
            Tag: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return newsletter as NewsletterDetail | null;
  } catch (error) {
    console.error("Error fetching newsletter:", error);
    return null;
  }
}

// Metadata generation
export async function generateMetadata({
  params,
}: {
  params: { brandname: string; newsletterId: string };
}): Promise<Metadata> {
  const newsletter = await getNewsletter(params.newsletterId);
  if (!newsletter) return notFound();

  const brandDisplayName = formatBrandName(params.brandname);
  const currentUrl = `https://newslettermonster.com/${params.brandname}/${params.newsletterId}`;

  return generateNewsletterMetadata({
    newsletter,
    brandname: params.brandname,
    brandDisplayName,
    currentUrl,
  });
}

// Main page component
export default async function NewsletterPage({
  params,
}: {
  params: { brandname: string; newsletterId: string };
}) {
  const newsletter = await getNewsletter(params.newsletterId);
  if (!newsletter) notFound();

  const brandDisplayName = formatBrandName(params.brandname);
  const currentUrl = `https://newslettermonster.com/${params.brandname}/${params.newsletterId}`;

  // Get the user session
  const session = await getServerSession(authOptions);
  const userId = session?.user?.user_id;

  // Check if the newsletter is liked and bookmarked by the current user
  let isLiked = false;
  let isBookmarked = false;

  if (userId) {
    // Only check these if the user is logged in
    isLiked = await checkIsNewsletterLiked(userId, newsletter.newsletter_id);
    isBookmarked = await isNewsletterBookmarked(userId, newsletter.newsletter_id);
  }

  return (
    <>
      <Script
        id="newsletter-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            NewsletterStructuredData({
              newsletter,
              brandname: params.brandname,
              brandDisplayName,
              currentUrl,
            })
          ),
        }}
      />

      <ThreeColumnLayout>
        <article className="relative mx-auto w-full max-w-3xl">
          <EmailHeader
            subject={newsletter.subject}
            sender={newsletter.sender}
            brandname={params.brandname}
            date={newsletter.created_at}
            badges={newsletter.badges}
          />

          {/* Email toolbar */}
          <EmailToolbar
            newsletterId={newsletter.newsletter_id}
            currentUrl={currentUrl}
            subject={newsletter.subject}
            summary={newsletter.summary}
            initialLikesCount={newsletter.likes_count || 0}
            initialYouRocksCount={newsletter.you_rocks_count || 0}
            initialIsLiked={isLiked}
            initialIsBookmarked={isBookmarked}
          />

          {/* Email content */}
          <EmailContent
            summary={newsletter.summary}
            fullScreenshotUrl={newsletter.full_screenshot_url}
            htmlFileUrl={newsletter.html_file_url}
            subject={newsletter.subject}
            tags={newsletter.NewsletterTag}
            productsLink={newsletter.products_link}
          />

          {/* SEO metadata */}
          <meta itemProp="datePublished" content={newsletter.created_at?.toISOString()} />
          <meta itemProp="publisher" content="NewsletterMonster" />
          <meta itemProp="author" content={brandDisplayName} />
          {newsletter.summary && <meta itemProp="description" content={newsletter.summary} />}

          <div className="flex flex-wrap gap-2">
            <LikeButton
              newsletterId={newsletter.newsletter_id}
              initialLikesCount={newsletter.likes_count || 0}
              initialIsLiked={isLiked}
            />
            <YouRockButton
              newsletterId={newsletter.newsletter_id}
              initialYouRocksCount={newsletter.you_rocks_count || 0}
            />
            <BookmarkButton
              newsletterId={newsletter.newsletter_id}
              initialIsBookmarked={isBookmarked}
            />
          </div>
        </article>
      </ThreeColumnLayout>
    </>
  );
}
