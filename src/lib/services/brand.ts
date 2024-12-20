import prisma from "@/lib/prisma";

interface Newsletter {
  newsletter_id: number;
  published_at: Date | null;
  subject: string | null;
  likes_count: number | null;
  you_rocks_count: number | null;
}

interface BrandProfile {
  user_id: string;
  name: string;
  profile_photo: string | null;
  bio: string | null;
  website: string | null;
  twitter_username: string | null;
  instagram_username: string | null;
  youtube_channel: string | null;
  linkedin_profile: string | null;
  newsletters: Newsletter[];
  followers_count: number;
  following_count: number;
}

export async function getBrandProfile(username: string): Promise<BrandProfile | null> {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      newsletters: {
        select: {
          newsletter_id: true,
          published_at: true,
          subject: true,
          likes_count: true,
          you_rocks_count: true,
        },
      },
      social_links: true,
      _count: {
        select: {
          follows: true,
        },
      },
    },
  });

  if (!user) return null;

  const followersCount = user._count.follows ?? 0;
  const followingCount = 0; // Since we don't track following anymore

  return {
    user_id: user.user_id,
    name: user.name,
    profile_photo: user.profile_photo,
    bio: user.bio,
    website: user.website,
    twitter_username: user.social_links?.twitter ?? null,
    instagram_username: user.social_links?.instagram ?? null,
    youtube_channel: user.social_links?.youtube ?? null,
    linkedin_profile: user.social_links?.linkedin ?? null,
    newsletters: user.newsletters,
    followers_count: followersCount,
    following_count: followingCount,
  };
}
