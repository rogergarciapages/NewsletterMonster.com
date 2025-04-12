// app/[brandname]/[newsletterId]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";

import { Card } from "@nextui-org/react";
import { getServerSession } from "next-auth";

import NewsletterCard from "@/app/components/brand/newsletter/card";
import EmailContent from "@/app/components/brand/newsletter/email-content";
import EmailHeader from "@/app/components/brand/newsletter/email-header";
import EmailToolbar from "@/app/components/brand/newsletter/email-toolbar";
import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";
import { BookmarkButton } from "@/app/components/newsletters/bookmark-button";
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

// Data fetching function for related newsletters from the same brand
async function getBrandNewsletters(
  brandname: string,
  currentNewsletterId: number,
  limit = 6
): Promise<any[]> {
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
    return newsletters;
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
): Promise<any[]> {
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

    return newsletters;
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

  if (userId) {
    // Only check these if the user is logged in
    isLiked = await checkIsNewsletterLiked(userId, newsletter.newsletter_id);
    isBookmarked = await isNewsletterBookmarked(userId, newsletter.newsletter_id);
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
    created_at: nl.created_at instanceof Date ? nl.created_at : new Date(nl.created_at),
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
    created_at: nl.created_at instanceof Date ? nl.created_at : new Date(nl.created_at),
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
              brandname={params.brandname}
            />

            {/* SEO metadata */}
            <meta itemProp="datePublished" content={newsletter.created_at?.toISOString()} />
            <meta itemProp="publisher" content="NewsletterMonster" />
            <meta itemProp="author" content={brandDisplayName} />
            {newsletter.summary && <meta itemProp="description" content={newsletter.summary} />}

            <div className="mb-6 mt-8 rounded-lg p-6">
              <h3 className="mb-2 text-xl font-bold text-gray-100">
                Like, share and rock this newsletter
              </h3>
              <p className="mb-4 text-gray-400">
                Show your appreciation for this content by liking, sharing with friends, or giving
                it a rock. Your engagement helps promote great newsletters!
              </p>

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
                <ShareButton
                  newsletterId={newsletter.newsletter_id}
                  url={currentUrl}
                  title={newsletter.subject || "Check out this newsletter"}
                />
              </div>
            </div>

            {/* Related Newsletters Section */}
            {brandNewsletters.length > 0 && (
              <div className="mt-12 border-t border-zinc-800 pt-8">
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
          </article>
        </Card>
      </ThreeColumnLayout>
    </>
  );
}
