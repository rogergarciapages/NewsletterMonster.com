// src/lib/services/user.ts
import { BrandUser } from "@/app/components/brand/profile/types";
import prisma from "@/lib/prisma";

export interface UserProfileData {
  user: BrandUser;
  newsletters: {
    newsletter_id: number;
    sender: string;
    subject: string;
    top_screenshot_url: string | null;
    likes_count: number;
    you_rocks_count: number;
    created_at: Date;
    summary: string | null;
    user_id: string;
  }[];
  followersCount: number;
  followingCount: number;
}

// Helper function to get first name
function getFirstName(fullName: string): string {
  return fullName.split(" ")[0].trim();
}

export async function getUserById(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
      select: {
        user_id: true,
        name: true,
        surname: true,
        username: true,
        email: true,
        profile_photo: true,
        bio: true,
        website: true,
        role: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Error in getUserById:", error);
    return null;
  }
}

export async function getUserProfile(userId: string): Promise<UserProfileData | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
      include: {
        Newsletter: true,
        _count: {
          select: {
            Follow: true,
          },
        },
        SocialLinks: true,
      },
    });

    if (!user) {
      return null;
    }

    // Get first name only
    const firstName = user.name.split(" ")[0];

    const transformedNewsletters = user.Newsletter.map(newsletter => ({
      newsletter_id: newsletter.newsletter_id,
      user_id: newsletter.user_id || user.user_id,
      sender: newsletter.sender || firstName,
      subject: newsletter.subject || "Untitled",
      top_screenshot_url: newsletter.top_screenshot_url,
      likes_count: newsletter.likes_count || 0,
      you_rocks_count: newsletter.you_rocks_count || 0,
      created_at: newsletter.created_at || new Date(),
      summary: newsletter.summary,
    }));

    const brandUser: BrandUser = {
      user_id: user.user_id,
      name: firstName,
      surname: user.surname,
      company_name: null,
      username: user.username,
      email: user.email,
      profile_photo: user.profile_photo,
      bio: user.bio,
      website: user.website,
      website_domain: null,
      domain_verified: false,
      twitter_username: user.SocialLinks?.twitter || null,
      instagram_username: user.SocialLinks?.instagram || null,
      youtube_channel: user.SocialLinks?.youtube || null,
      linkedin_profile: user.SocialLinks?.linkedin || null,
      role: user.role,
    };

    return {
      user: brandUser,
      newsletters: transformedNewsletters,
      followersCount: user._count.Follow,
      followingCount: 0,
    };
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    throw error;
  }
}
