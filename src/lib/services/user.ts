// src/lib/services/user.ts
import { BrandUser } from "@/app/components/brand/profile/types";
import { prisma } from "@/lib/prisma";

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

export async function getUserProfile(userId: string): Promise<UserProfileData | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
      include: {
        newsletters: {
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
        },
        _count: {
          select: {
            follows: true,
          },
        },
        social_links: true,
      },
    });

    if (!user) return null;

    // Get first name only
    const firstName = getFirstName(user.name);

    // Transform newsletters to ensure non-null values where required
    const transformedNewsletters = user.newsletters.map(newsletter => ({
      newsletter_id: newsletter.newsletter_id,
      sender: newsletter.sender || firstName,
      subject: newsletter.subject || "Untitled",
      top_screenshot_url: newsletter.top_screenshot_url,
      likes_count: newsletter.likes_count || 0,
      you_rocks_count: newsletter.you_rocks_count || 0,
      created_at: newsletter.created_at || new Date(),
      summary: newsletter.summary,
      user_id: newsletter.user_id || user.user_id,
    }));

    // Create BrandUser object with all required fields
    const brandUser: BrandUser = {
      user_id: user.user_id,
      name: firstName,
      email: user.email,
      surname: user.surname,
      company_name: null,
      username: user.username,
      profile_photo: user.profile_photo,
      bio: user.bio,
      website: user.website,
      website_domain: null,
      domain_verified: false,
      twitter_username: user.social_links?.twitter || null,
      instagram_username: user.social_links?.instagram || null,
      youtube_channel: user.social_links?.youtube || null,
      linkedin_profile: user.social_links?.linkedin || null,
      role: user.role,
    };

    return {
      user: brandUser,
      newsletters: transformedNewsletters,
      followersCount: user._count.follows,
      followingCount: 0,
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}
