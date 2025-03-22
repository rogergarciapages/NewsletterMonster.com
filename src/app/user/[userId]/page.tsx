// src/app/user/[userId]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { Button } from "@nextui-org/react";
import { IconBuildingStore, IconEdit } from "@tabler/icons-react";
import { getServerSession } from "next-auth/next";

import BrandProfileHeaderWrapper from "@/app/components/brand/profile/header/client-wrapper";
import EmailCopyProfile from "@/app/components/email-copy-profile";
import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";
import { NewsletterCard } from "@/app/components/newsletters/newsletter-card";
import { authOptions } from "@/config/auth";
import prisma from "@/lib/prisma";
import { BrandProfile } from "@/types/brands";

interface UserProfileData {
  newsletters: Array<{
    newsletter_id: number;
    sender: string | null;
    subject: string | null;
    top_screenshot_url: string | null;
    likes_count: number | null;
    you_rocks_count: number | null;
    created_at: Date | null;
    summary: string | null;
    user_id: string | null;
  }>;
  user: {
    user_id: string;
    name: string;
    surname: string;
    company_name: string;
    username: string;
    email: string;
    profile_photo: string | null;
    bio: string;
    website: string | null;
    website_domain: string | null;
    domain_verified: boolean;
    twitter_username: string | null;
    instagram_username: string | null;
    youtube_channel: string | null;
    linkedin_profile: string | null;
    role: string;
  };
  followersCount: number;
}

// Add caching configuration
export const revalidate = 60; // Revalidate every 60 seconds

// Cache the user data fetch function
async function getUserData(userIdentifier: string): Promise<UserProfileData | null> {
  try {
    // First try to find by username
    let user = await prisma!.user.findUnique({
      where: { username: userIdentifier },
      include: { SocialLinks: true },
    });

    // If not found by username, try by user_id (UUID)
    if (!user) {
      user = await prisma!.user.findUnique({
        where: { user_id: userIdentifier },
        include: { SocialLinks: true },
      });
    }

    if (!user) {
      return null;
    }

    // Use Promise.all to parallelize database queries for newsletters and followers
    const [newsletters, followersCount] = await Promise.all([
      prisma!.newsletter.findMany({
        where: { user_id: user.user_id },
        orderBy: { created_at: "desc" },
        select: {
          newsletter_id: true,
          sender: true,
          subject: true,
          top_screenshot_url: true,
          likes_count: true,
          you_rocks_count: true,
          created_at: true,
          summary: true,
          user_id: true,
        },
      }),
      prisma!.follow.count({
        where: { brand_id: user.user_id },
      }),
    ]);

    return {
      newsletters,
      user: {
        user_id: user.user_id,
        name: user.name || "",
        surname: "",
        company_name: user.name || "",
        username: user.username || user.user_id,
        email: user.email || "",
        profile_photo: user.profile_photo,
        bio: user.bio || "",
        website: user.website || null,
        website_domain: null,
        domain_verified: false,
        twitter_username: user.SocialLinks?.twitter || null,
        instagram_username: user.SocialLinks?.instagram || null,
        youtube_channel: user.SocialLinks?.youtube || null,
        linkedin_profile: user.SocialLinks?.linkedin || null,
        role: "USER",
      },
      followersCount,
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

// Generate metadata with caching
export async function generateMetadata({
  params,
}: {
  params: { userId: string };
}): Promise<Metadata> {
  const userData = await getUserData(params.userId);

  if (!userData) {
    return {
      title: "User Not Found | Newsletter Monster",
      description: "This user profile could not be found.",
    };
  }

  const { user, newsletters, followersCount } = userData;
  const displayName = user.username || user.name || "User";

  // Generate canonical URL based on username if available
  const canonicalUrl = user.username ? `/user/${user.username}` : `/user/${params.userId}`;

  // Update user data with corrected profile image URL
  if (userData?.user && userData.user.profile_photo) {
    userData.user.profile_photo = ensureCorrectImageUrl(userData.user.profile_photo);
  }

  return {
    title: `${displayName}'s Profile | Newsletter Monster`,
    description: `View ${displayName}'s profile and newsletters on Newsletter Monster. Following: ${followersCount} | Newsletters: ${newsletters.length}`,
    openGraph: {
      title: `${displayName}'s Profile | Newsletter Monster`,
      description: `Check out ${displayName}'s newsletters and updates on Newsletter Monster`,
      images: user.profile_photo ? [{ url: user.profile_photo }] : undefined,
      type: "profile",
      firstName: user.name || undefined,
      username: user.username || undefined,
      siteName: "Newsletter Monster",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${displayName}'s Profile | Newsletter Monster`,
      description: `Check out ${displayName}'s newsletters and updates on Newsletter Monster`,
      creator: user.twitter_username ? `@${user.twitter_username}` : undefined,
      images: user.profile_photo ? [user.profile_photo] : undefined,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

// Utility function to ensure profile image URL has the correct structure
function ensureCorrectImageUrl(url: string | null): string | null {
  if (!url) return null;

  console.log("Ensuring correct image URL for:", url);

  // If URL already starts with the expected pattern, return it as is
  if (url.includes("/userpics/public/")) {
    console.log("URL appears to be in correct format already");
    return url;
  }

  // Extract the file extension from the original URL
  const extensionMatch = url.match(/\.([a-z]+)$/i);
  const fileExtension = extensionMatch ? extensionMatch[1].toLowerCase() : "jpg";

  // Try to extract the user ID from the URL
  const match = url.match(/\/([a-f0-9-]+)\/([a-f0-9-]+)(-\d+)?\.(jpg|jpeg|png|webp|gif)$/i);
  if (match) {
    const userId = match[1];
    // Use the extension from the original URL if available, otherwise use the extracted one
    const extension = match[4] ? match[4].toLowerCase() : fileExtension;

    // Construct the URL with the correct path structure (without timestamp)
    const minioEndpoint = url.split("/userpics")[0];
    const correctedUrl = `${minioEndpoint}/userpics/public/${userId}/${userId}.${extension}`;
    console.log("Corrected URL:", correctedUrl);
    return correctedUrl;
  }

  console.log("URL correction failed, returning original URL");
  return url;
}

export default async function UserProfilePage({ params }: { params: { userId: string } }) {
  // Parallel data fetching
  const [data, session] = await Promise.all([
    getUserData(params.userId),
    getServerSession(authOptions),
  ]);

  if (!data) {
    notFound();
  }

  const { newsletters, user, followersCount } = data;
  // Check if profile belongs to current user by comparing both user_id and username
  const isOwnProfile: boolean =
    (!!session?.user?.user_id && session.user.user_id === user.user_id) ||
    !!(session?.user?.username && session.user.username === params.userId);

  const brandProfile: BrandProfile = {
    user_id: user.user_id,
    company_name: user.company_name,
    profile_photo: user.profile_photo,
    bio: user.bio,
    website: user.website,
    website_domain: user.website_domain || "",
    domain_verified: user.domain_verified || false,
    twitter_username: user.twitter_username,
    instagram_username: user.instagram_username,
    youtube_channel: user.youtube_channel,
    linkedin_profile: user.linkedin_profile,
    newsletters: newsletters.map(newsletter => ({
      newsletter_id: newsletter.newsletter_id,
      subject: newsletter.subject || "",
      date: newsletter.created_at || new Date(),
      likes_count: newsletter.likes_count || 0,
      you_rocks_count: newsletter.you_rocks_count || 0,
    })),
    followers_count: followersCount,
    following_count: 0,
  };

  return (
    <ThreeColumnLayout>
      <div className="w-full">
        <BrandProfileHeaderWrapper
          brandId={user.user_id}
          brandName={user.name}
          brand={{
            brand_id: user.user_id,
            name: user.name,
            slug: user.username || user.user_id,
            description: user.bio,
            website: user.website,
            domain: user.website_domain,
            logo: user.profile_photo,
            is_claimed: user.domain_verified,
            is_verified: user.domain_verified,
            created_at: null,
            updated_at: null,
            SocialLinks: {
              user_id: user.user_id,
              brand_id: user.user_id,
              id: user.user_id,
              twitter: user.twitter_username,
              instagram: user.instagram_username,
              linkedin: user.linkedin_profile,
              youtube: user.youtube_channel,
              github: null,
              facebook: null,
            },
          }}
          newsletterCount={newsletters.length}
          followersCount={followersCount}
          isFollowing={false}
          hideFollowButton={!!isOwnProfile}
          isOwnProfile={!!isOwnProfile}
        />

        {isOwnProfile && (
          <div className="mx-auto mt-4 flex max-w-6xl gap-4 px-4">
            <Button
              color="warning"
              variant="solid"
              startContent={<IconEdit size={20} />}
              href={`/user/${params.userId}/edit`}
              as="a"
              className="w-full sm:w-auto"
            >
              Edit my Profile
            </Button>
            <Button
              color="primary"
              variant="solid"
              startContent={<IconBuildingStore size={20} />}
              href="/brand/create"
              as="a"
              className="w-full sm:w-auto"
            >
              Create Brand Page
            </Button>
          </div>
        )}

        <main className="mx-auto max-w-6xl px-4 py-8">
          <h1 className="sr-only">{user.name}&apos;s Newsletters</h1>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {newsletters.length > 0 ? (
              newsletters.map((newsletter, index) => (
                <div key={newsletter.newsletter_id} className="w-full">
                  <NewsletterCard
                    newsletter={newsletter}
                    priority={index < 3} // Only prioritize the first 3 newsletters
                    showBadges={false}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-3 flex h-[200px] w-full flex-col items-center justify-center gap-4 rounded-md bg-zinc-50 p-8 text-center dark:bg-zinc-900">
                <IconBuildingStore className="h-12 w-12 text-gray-400" />
                <div>
                  <h3 className="mb-1 text-lg font-medium">
                    {user.name} hasn&apos;t published any newsletters yet
                  </h3>
                  <p className="mb-4 text-sm text-gray-500">
                    Their newsletters will appear here once they start publishing.
                  </p>

                  {isOwnProfile && (
                    <Button as="a" color="primary" href="/newsletters/explore" className="mx-auto">
                      Browse Newsletters
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
          <EmailCopyProfile user={brandProfile} isOwnProfile={isOwnProfile} />
        </main>
      </div>
    </ThreeColumnLayout>
  );
}
