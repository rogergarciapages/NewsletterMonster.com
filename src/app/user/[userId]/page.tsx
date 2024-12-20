// src/app/user/[userId]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { Button } from "@nextui-org/react";
import { IconBuildingStore, IconEdit } from "@tabler/icons-react";
import { getServerSession } from "next-auth/next";

import NewsletterCard from "@/app/components/brand/newsletter/card";
import { Newsletter } from "@/app/components/brand/newsletter/types";
import BrandProfileHeaderWrapper from "@/app/components/brand/profile/header/client-wrapper";
import { BrandUser } from "@/app/components/brand/profile/types";
import EmailCopyProfile from "@/app/components/email-copy-profile";
import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";
import { authOptions } from "@/config/auth";
import prisma from "@/lib/prisma";
import { BrandProfile } from "@/types/brands";

export const revalidate = 0;
export const dynamic = "force-dynamic";

interface UserProfileData {
  newsletters: Newsletter[];
  user: BrandUser;
  followersCount: number;
}

// Generate metadata for SEO
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
      other: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    };
  }

  const { user, newsletters, followersCount } = userData;
  const displayName = user.username || user.name || "User";

  return {
    title: `${displayName}&quot;s Profile | Newsletter Monster`,
    description: `View ${displayName} profile and newsletters on Newsletter Monster. Following: ${followersCount} | Newsletters: ${newsletters.length}`,
    openGraph: {
      title: `${displayName} Profile | Newsletter Monster`,
      description: `Check out ${displayName}&quot;s newsletters and updates on Newsletter Monster`,
      images: user.profile_photo ? [{ url: user.profile_photo }] : undefined,
      type: "profile",
      firstName: user.name || undefined,
      username: user.username || undefined,
      siteName: "Newsletter Monster",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${displayName}/'s Profile | Newsletter Monster`,
      description: `Check out ${displayName} newsletters and updates on Newsletter Monster`,
      creator: user.twitter_username ? `@${user.twitter_username}` : undefined,
      images: user.profile_photo ? [user.profile_photo] : undefined,
    },
    alternates: {
      canonical: `/user/${params.userId}`,
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
    other: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  };
}

async function getUserData(userId: string): Promise<UserProfileData | null> {
  try {
    console.log(`Fetching user data for ID: ${userId}`);
    const user = await prisma.user.findUnique({
      where: {
        user_id: userId,
      },
      include: {
        social_links: true,
      },
    });

    if (!user) {
      console.log(`No user found for ID: ${userId}`);
      return null;
    }

    console.log(`Found user: ${user.name}`);

    const newsletters = await prisma.newsletter.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: "desc",
      },
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
    });

    const followersCount = await prisma.follow.count({
      where: {
        brand_id: userId,
      },
    });

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
        twitter_username: user.social_links?.twitter || null,
        instagram_username: user.social_links?.instagram || null,
        youtube_channel: user.social_links?.youtube || null,
        linkedin_profile: user.social_links?.linkedin || null,
        role: "USER",
      },
      followersCount,
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error; // Re-throw to trigger error boundary
  }
}

export default async function UserProfilePage({ params }: { params: { userId: string } }) {
  const [data, session] = await Promise.all([
    getUserData(params.userId),
    getServerSession(authOptions),
  ]);

  if (!data) {
    notFound();
  }

  const { newsletters, user, followersCount } = data;
  const isOwnProfile = session?.user?.user_id === params.userId;

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
    following_count: 0, // You might want to fetch this if needed
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
            social_links: {
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
          hideFollowButton={isOwnProfile}
          isOwnProfile={isOwnProfile}
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {newsletters.map(newsletter => (
              <NewsletterCard
                key={newsletter.newsletter_id}
                newsletter={newsletter}
                brandname={user.username || user.name}
              />
            ))}
          </div>
          <EmailCopyProfile
            user={brandProfile} // Now includes website_domain and domain_verified
            isOwnProfile={isOwnProfile}
          />
        </main>
      </div>
    </ThreeColumnLayout>
  );
}
