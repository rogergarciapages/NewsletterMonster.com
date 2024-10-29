// src/lib/services/user.ts
import { BrandUser } from "@/app/components/brand/profile/types";
import { prisma } from "../prisma-client";

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
        Newsletter: {
          orderBy: {
            created_at: "desc"
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
          }
        },
        _count: {
          select: {
            followers: true,
            following: true
          }
        }
      }
    });

    if (!user) return null;

    // Get first name only
    const firstName = getFirstName(user.name);

    // Transform newsletters to ensure non-null values where required
    const transformedNewsletters = user.Newsletter.map(newsletter => ({
      newsletter_id: newsletter.newsletter_id,
      sender: newsletter.sender || firstName, // Use first name only
      subject: newsletter.subject || "Untitled",
      top_screenshot_url: newsletter.top_screenshot_url,
      likes_count: newsletter.likes_count || 0,
      you_rocks_count: newsletter.you_rocks_count || 0,
      created_at: newsletter.created_at || new Date(),
      summary: newsletter.summary,
      user_id: newsletter.user_id || user.user_id,
    }));

    return {
      user: {
        ...user,
        name: firstName, // Use first name only for the user object
      },
      newsletters: transformedNewsletters,
      followersCount: user._count.followers,
      followingCount: user._count.following
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}