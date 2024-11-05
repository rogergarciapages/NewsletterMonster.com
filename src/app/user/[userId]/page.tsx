import { Metadata } from "next";
import { notFound } from "next/navigation";

import { Button } from "@nextui-org/react";
import { IconEdit } from "@tabler/icons-react";

import NewsletterCard from "@/app/components/brand/newsletter/card";
import { Newsletter } from "@/app/components/brand/newsletter/types";
import BrandProfileHeaderWrapper from "@/app/components/brand/profile/header/client-wrapper";
import { BrandUser } from "@/app/components/brand/profile/types";
import EmailCopyProfile from "@/app/components/email-copy-profile";
import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";
import { prisma } from "@/lib/prisma-client";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  other: {
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  },
};

interface UserProfileData {
  newsletters: Newsletter[];
  user: BrandUser;
  followersCount: number;
}

async function getUserData(userId: string): Promise<UserProfileData | null> {
  try {
    const timestamp = Date.now();
    const user = await prisma.user.findUnique({
      where: {
        user_id: userId,
      },
      select: {
        user_id: true,
        name: true,
        surname: true,
        company_name: true,
        username: true,
        email: true,
        profile_photo: true,
        bio: true,
        website: true,
        twitter_username: true,
        instagram_username: true,
        youtube_channel: true,
        linkedin_profile: true,
        role: true,
      },
    });

    if (!user) return null;

    // Add cache busting to profile photo URL
    if (user.profile_photo) {
      user.profile_photo = `${user.profile_photo}?t=${timestamp}`;
    }

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
        following_id: userId,
      },
    });

    return {
      newsletters,
      user,
      followersCount,
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

export default async function UserProfilePage({ params }: { params: { userId: string } }) {
  const data = await getUserData(params.userId);

  if (!data) {
    notFound();
  }

  const { newsletters, user, followersCount } = data;

  return (
    <ThreeColumnLayout>
      <div className="w-full">
        <BrandProfileHeaderWrapper
          brandName={user.name}
          user={user}
          newsletterCount={newsletters.length}
          followersCount={followersCount}
          isFollowing={false}
          hideFollowButton={true}
          isOwnProfile={true}
        />

        <div className="mx-auto mt-4 max-w-6xl px-4">
          <Button
            color="primary"
            variant="flat"
            startContent={<IconEdit size={20} />}
            href={`/user/${params.userId}/edit`}
            as="a"
            className="w-full sm:w-auto"
          >
            Edit my Profile
          </Button>
        </div>

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
          <EmailCopyProfile />
        </main>
      </div>
    </ThreeColumnLayout>
  );
}
