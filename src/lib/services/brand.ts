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
      Newsletter: true,
      SocialLinks: true,
      _count: {
        select: {
          Follow: true,
        },
      },
    },
  });

  if (!user) return null;

  const followersCount = user._count.Follow ?? 0;
  const followingCount = 0; // Since we don't track following anymore

  const newsletterCount = user.Newsletter?.length ?? 0;

  return {
    user_id: user.user_id,
    name: user.name,
    profile_photo: user.profile_photo,
    bio: user.bio,
    website: user.website,
    twitter_username: user.SocialLinks?.twitter ?? null,
    instagram_username: user.SocialLinks?.instagram ?? null,
    youtube_channel: user.SocialLinks?.youtube ?? null,
    linkedin_profile: user.SocialLinks?.linkedin ?? null,
    newsletters: user.Newsletter,
    followers_count: followersCount,
    following_count: followingCount,
  };
}
