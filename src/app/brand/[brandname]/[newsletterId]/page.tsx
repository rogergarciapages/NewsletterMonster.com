// app/[brandname]/[newsletterId]/page.tsx
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";

import { Card } from "@nextui-org/react";
import { getServerSession } from "next-auth";

import NewsletterCard from "@/app/components/brand/newsletter/card";
import EmailContent from "@/app/components/brand/newsletter/email-content";
import FollowButton from "@/app/components/brand/profile/header/follow-button";
import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";
import { BookmarkButton } from "@/app/components/newsletters/bookmark-button";
import { DownloadButton } from "@/app/components/newsletters/download-button";
import { LikeButton } from "@/app/components/newsletters/like-button";
import { ShareButton } from "@/app/components/newsletters/share-button";
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
  key_insights: string | null;
  brand_id?: string | null;
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
  Brand?: {
    brand_id: string;
    name: string | null;
    logo: string | null;
    description: string | null;
    follower_count?: number;
  };
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

// Define a type for the newsletter result from the database query
type NewsletterResult = {
  newsletter_id: number;
  sender: string | null;
  subject: string | null;
  top_screenshot_url: string | null;
  likes_count: number | null;
  you_rocks_count: number | null;
  created_at: Date | string | null;
};

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

// Add a function to check if a user follows a brand
async function checkIsFollowingBrand(userId: string, brandId: string | null): Promise<boolean> {
  if (!userId || !brandId) return false;

  try {
    const follow = await prisma.follow.findFirst({
      where: {
        follower_id: userId,
        brand_id: brandId,
      },
    });

    return !!follow;
  } catch (error) {
    console.error("Error checking follow status:", error);
    return false;
  }
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
        key_insights: true,
        brand_id: true,
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
        Brand: {
          select: {
            brand_id: true,
            name: true,
            logo: true,
            description: true,
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

// Data fetching function for related newsletters from the same brand
async function getBrandNewsletters(
  brandname: string,
  currentNewsletterId: number,
  limit = 6
): Promise<NewsletterResult[]> {
  try {
    // Create variations of the brand name for searching
    const brandKeyword = brandname.split("-").join(" ");
    const brandCapitalized = brandKeyword
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    console.log("Searching for brand newsletters with variations:", {
      brandname,
      brandKeyword,
      brandCapitalized,
    });

    const newsletters = await prisma.newsletter.findMany({
      where: {
        OR: [
          { sender: { contains: brandKeyword } },
          { sender: { contains: brandKeyword.toLowerCase() } },
          { sender: { contains: brandCapitalized } },
          { sender_slug: brandname },
          // Try to match based on partial sender name
          ...brandKeyword
            .split(" ")
            .map(word => ({
              sender: { contains: word.length > 3 ? word : undefined },
            }))
            .filter(item => item.sender.contains),
        ],
        newsletter_id: {
          not: currentNewsletterId, // Exclude the current newsletter
        },
      },
      select: {
        newsletter_id: true,
        sender: true,
        subject: true,
        top_screenshot_url: true,
        likes_count: true,
        you_rocks_count: true,
        created_at: true,
      },
      orderBy: {
        created_at: "desc",
      },
      take: limit,
    });

    console.log(`Found ${newsletters.length} related newsletters for brand: ${brandname}`);
    return newsletters as NewsletterResult[];
  } catch (error) {
    console.error("Error fetching brand newsletters:", error);
    return [];
  }
}

// Data fetching function for related newsletters from the same category/tags
async function getCategoryNewsletters(
  tags: number[],
  brandname: string,
  currentNewsletterId: number,
  limit = 6
): Promise<NewsletterResult[]> {
  if (!tags.length) return [];

  try {
    // Alternative approach: search on sender field for different possible forms of the brand name
    const brandKeyword = brandname.split("-").join(" ");

    const newsletters = await prisma.newsletter.findMany({
      where: {
        NewsletterTag: {
          some: {
            tag_id: {
              in: tags,
            },
          },
        },
        newsletter_id: {
          not: currentNewsletterId, // Exclude the current newsletter
        },
        NOT: [
          { sender: { contains: brandKeyword } },
          { sender: { contains: brandKeyword.toLowerCase() } },
          { sender_slug: brandname },
        ],
      },
      select: {
        newsletter_id: true,
        sender: true,
        subject: true,
        top_screenshot_url: true,
        likes_count: true,
        you_rocks_count: true,
        created_at: true,
      },
      orderBy: {
        created_at: "desc",
      },
      take: limit,
    });

    return newsletters as NewsletterResult[];
  } catch (error) {
    console.error("Error fetching category newsletters:", error);
    return [];
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
  let isFollowing = false;

  if (userId) {
    // Only check these if the user is logged in
    isLiked = await checkIsNewsletterLiked(userId, newsletter.newsletter_id);
    isBookmarked = await isNewsletterBookmarked(userId, newsletter.newsletter_id);

    // Check if following brand
    if (newsletter.brand_id) {
      isFollowing = await checkIsFollowingBrand(userId, newsletter.brand_id);
    }
  }

  // Extract tag IDs for related newsletters
  const tagIds = newsletter.NewsletterTag.map(tag => tag.Tag.id);

  // Fetch related newsletters
  let brandNewslettersRaw = await getBrandNewsletters(params.brandname, newsletter.newsletter_id);
  const categoryNewslettersRaw = await getCategoryNewsletters(
    tagIds,
    params.brandname,
    newsletter.newsletter_id
  );

  // If no brand newsletters found, fetch some recent newsletters as fallback
  if (brandNewslettersRaw.length === 0) {
    console.log("No brand newsletters found, fetching recent newsletters as fallback");
    try {
      brandNewslettersRaw = await prisma.newsletter.findMany({
        where: {
          newsletter_id: {
            not: newsletter.newsletter_id,
          },
        },
        select: {
          newsletter_id: true,
          sender: true,
          subject: true,
          top_screenshot_url: true,
          likes_count: true,
          you_rocks_count: true,
          created_at: true,
        },
        orderBy: {
          created_at: "desc",
        },
        take: 3,
      });
      console.log(`Fetched ${brandNewslettersRaw.length} recent newsletters as fallback`);
    } catch (error) {
      console.error("Error fetching fallback newsletters:", error);
    }
  }

  // Map the newsletters to match our expected format with proper type handling
  const brandNewsletters = brandNewslettersRaw.map(nl => ({
    newsletter_id: nl.newsletter_id,
    sender: nl.sender,
    subject: nl.subject,
    top_screenshot_url: nl.top_screenshot_url,
    likes_count: nl.likes_count || 0,
    you_rocks_count: nl.you_rocks_count || 0,
    created_at: nl.created_at
      ? nl.created_at instanceof Date
        ? nl.created_at
        : new Date(nl.created_at)
      : null,
    summary: null,
    user_id: null,
  }));

  const categoryNewsletters = categoryNewslettersRaw.map(nl => ({
    newsletter_id: nl.newsletter_id,
    sender: nl.sender,
    subject: nl.subject,
    top_screenshot_url: nl.top_screenshot_url,
    likes_count: nl.likes_count || 0,
    you_rocks_count: nl.you_rocks_count || 0,
    created_at: nl.created_at
      ? nl.created_at instanceof Date
        ? nl.created_at
        : new Date(nl.created_at)
      : null,
    summary: null,
    user_id: null,
  }));

  // Debug logs for related newsletters
  console.log("DEBUG Related Newsletters:");
  console.log("Brand name:", params.brandname);
  console.log("Current newsletter ID:", newsletter.newsletter_id);
  console.log("Brand newsletters raw count:", brandNewslettersRaw.length);
  console.log("Brand newsletters mapped count:", brandNewsletters.length);
  console.log("First few brand newsletters:", brandNewsletters.slice(0, 2));

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
        <Card className="border-none bg-[rgb(24_24_27/var(--tw-bg-opacity))] shadow-none">
          <article className="mx-auto max-w-5xl px-4 py-8">
            {/* Newsletter Title as H1 */}
            <h1 className="mb-6 text-3xl font-bold text-gray-100">{newsletter.subject}</h1>

            {/* Date info only */}
            <div className="mb-6 space-y-2 text-sm">
              {newsletter.created_at && (
                <div className="grid grid-cols-[80px,1fr] items-center">
                  <span className="text-gray-500 dark:text-gray-400">Date:</span>
                  <time className="text-gray-200" dateTime={newsletter.created_at.toISOString()}>
                    {newsletter.created_at.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </div>
              )}

              {/* Display badges if any */}
              {newsletter.badges && newsletter.badges.length > 0 && (
                <div className="flex gap-4 pt-4">
                  {newsletter.badges.map(badge => (
                    <div
                      key={badge.id}
                      className="relative h-16 w-16 transition-transform hover:scale-110"
                    >
                      <Image
                        src={`/badges/${badge.rank.charAt(0) + (badge.category === "DAY" ? "d" : badge.category === "WEEK" ? "w" : "m")}.png`}
                        alt={`${badge.rank} ${badge.type} ${badge.category} badge`}
                        fill
                        className="object-contain drop-shadow-lg"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* YouTube-style channel info */}
            <div className="mb-6 rounded-xl bg-zinc-800/50 p-6">
              {/* Left: Channel info (profile picture, name, follower count) */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Link href={`/brand/${params.brandname}`} className="shrink-0">
                    {newsletter.Brand?.logo ? (
                      <Image
                        src={newsletter.Brand.logo}
                        alt={brandDisplayName}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full object-cover transition-all hover:opacity-90"
                        priority
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-700 text-lg font-bold uppercase text-white">
                        {brandDisplayName.charAt(0)}
                      </div>
                    )}
                  </Link>
                  <div>
                    <Link
                      href={`/brand/${params.brandname}`}
                      className="text-lg font-semibold text-gray-200 hover:text-primary"
                    >
                      {brandDisplayName}
                    </Link>
                    <div className="text-sm text-gray-400">
                      {newsletter.Brand?.follower_count
                        ? `${newsletter.Brand.follower_count.toLocaleString()} followers`
                        : "0 followers"}
                    </div>
                  </div>

                  <FollowButton
                    brandId={newsletter.brand_id || ""}
                    isFollowing={isFollowing}
                    className="ml-4"
                  />
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap items-center gap-1">
                  <LikeButton
                    newsletterId={newsletter.newsletter_id}
                    initialLikesCount={newsletter.likes_count || 0}
                    initialIsLiked={isLiked}
                    size="md"
                    className="min-w-[90px] rounded-full bg-zinc-800 px-3 hover:bg-zinc-700"
                  />
                  <YouRockButton
                    newsletterId={newsletter.newsletter_id}
                    initialYouRocksCount={newsletter.you_rocks_count || 0}
                    size="md"
                    className="min-w-[90px] rounded-full bg-zinc-800 px-3 hover:bg-zinc-700"
                  />
                  <ShareButton
                    newsletterId={newsletter.newsletter_id}
                    url={currentUrl}
                    title={newsletter.subject || "Check out this newsletter"}
                    size="md"
                    className="min-w-[90px] rounded-full bg-zinc-800 px-3 hover:bg-zinc-700"
                  />
                  <BookmarkButton
                    newsletterId={newsletter.newsletter_id}
                    initialIsBookmarked={isBookmarked}
                    size="md"
                    className="min-w-[90px] rounded-full bg-zinc-800 px-3 hover:bg-zinc-700"
                  />
                  <DownloadButton
                    newsletterId={newsletter.newsletter_id}
                    fullScreenshotUrl={newsletter.full_screenshot_url}
                    htmlFileUrl={newsletter.html_file_url}
                    size="md"
                    className="min-w-[90px] rounded-full bg-zinc-800 px-3 hover:bg-zinc-700"
                  />
                </div>
              </div>
            </div>

            {/* Key Insights Section is now inside EmailContent */}
            <EmailContent
              summary={newsletter.summary}
              key_insights={newsletter.key_insights}
              fullScreenshotUrl={newsletter.full_screenshot_url}
              htmlFileUrl={newsletter.html_file_url}
              subject={newsletter.subject}
              tags={newsletter.NewsletterTag}
              productsLink={newsletter.products_link}
              brandname={params.brandname}
            />

            {/* SEO metadata */}
            <meta itemProp="datePublished" content={newsletter.created_at?.toISOString()} />
            <meta itemProp="publisher" content="NewsletterMonster" />
            <meta itemProp="author" content={brandDisplayName} />
            {newsletter.summary && <meta itemProp="description" content={newsletter.summary} />}

            {/* Related Newsletters Sections */}
            <div className="mt-12 border-t border-zinc-800 pt-8">
              {/* Brand-specific newsletters */}
              {brandNewsletters.length > 0 && (
                <div className="mb-12">
                  <h2 className="mb-6 text-2xl font-bold text-gray-100">
                    {brandNewslettersRaw.some(
                      nl =>
                        nl.sender?.includes(brandDisplayName) ||
                        nl.sender?.includes(params.brandname.replace("-", " "))
                    )
                      ? `Related newsletters from ${brandDisplayName}`
                      : "You might also like these newsletters"}
                  </h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {brandNewsletters.slice(0, 6).map(newsletter => (
                      <div key={newsletter.newsletter_id} className="overflow-hidden">
                        <NewsletterCard newsletter={newsletter} brandname={params.brandname} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Topic-related newsletters (by tags) */}
              {categoryNewsletters.length > 0 && (
                <div>
                  <h2 className="mb-6 text-2xl font-bold text-gray-100">
                    Similar newsletters you might enjoy
                  </h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {categoryNewsletters.slice(0, 6).map(newsletter => (
                      <div key={newsletter.newsletter_id} className="overflow-hidden">
                        <NewsletterCard newsletter={newsletter} brandname={params.brandname} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>
        </Card>
      </ThreeColumnLayout>
    </>
  );
}
