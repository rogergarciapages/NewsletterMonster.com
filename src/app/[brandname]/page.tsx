// src/app/[brandname]/page.tsx
import NewsletterCard from "@/app/components/brand/newsletter/card";
import BrandProfileHeaderWrapper from "@/app/components/brand/profile/header/client-wrapper";
import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";
import { prisma } from "@/lib/prisma-client";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Newsletter } from "../components/brand/newsletter/types";
import { BrandUser } from "../components/brand/profile/types";

interface BrandData {
  newsletters: Newsletter[];
  user: BrandUser | null;
  followersCount: number;
}

export async function generateMetadata({ 
  params 
}: { 
  params: { brandname: string } 
}): Promise<Metadata> {
  const displayName = formatBrandName(params.brandname);

  return {
    title: `${displayName} Newsletters | NewsletterMonster`,
    description: `Browse all newsletters from ${displayName}. Get the latest updates and insights.`,
  };
}

function formatBrandName(brandname: string): string {
  return brandname.split("-").map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(" ");
}

async function getBrandData(brandname: string): Promise<BrandData | null> {
  try {
    // First try to find a user that matches the brand name
    const brandUser = await prisma.user.findFirst({
      where: {
        OR: [
          { company_name: { contains: brandname.replace(/-/g, " "), mode: "insensitive" } },
          { username: { equals: brandname, mode: "insensitive" } }
        ]
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
        role: true
      }
    });

    // Then get newsletters
    const newsletters = await prisma.newsletter.findMany({
      where: {
        OR: [
          {
            sender: {
              contains: brandname.replace(/-/g, " "),
              mode: "insensitive",
            }
          },
          {
            user_id: brandUser?.user_id
          }
        ]
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

    if (!newsletters.length) {
      return null;
    }

    // Get followers count using the follow table
    let followersCount = 0;
    if (brandUser) {
      followersCount = await prisma.follow.count({
        where: {
          OR: [
            { following_id: brandUser.user_id },
            { following_name: brandname }
          ]
        }
      });
    } else {
      // If no user found, count followers for unclaimed brand
      followersCount = await prisma.follow.count({
        where: {
          following_name: brandname
        }
      });
    }

    return {
      newsletters,
      user: brandUser,
      followersCount
    };
  } catch (error) {
    console.error("Error fetching brand data:", error);
    return null;
  }
}

export default async function BrandPage({ 
  params 
}: { 
  params: { brandname: string } 
}) {
  const data = await getBrandData(params.brandname);
  
  if (!data) {
    notFound();
  }

  const { newsletters, user, followersCount } = data;
  const brandDisplayName = formatBrandName(params.brandname);

  return (
    <ThreeColumnLayout>
      <div className="w-full text-[#111]">
        <BrandProfileHeaderWrapper 
          brandName={brandDisplayName}
          user={user}
          newsletterCount={newsletters.length}
          followersCount={followersCount}
          isFollowing={false} // This will be handled by the client component
        />
        
        <div className="max-w-6xl mx-auto px-1 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {newsletters.map((newsletter) => (
              <NewsletterCard
                key={newsletter.newsletter_id}
                newsletter={newsletter}
                brandname={params.brandname}
              />
            ))}
          </div>
        </div>
      </div>
    </ThreeColumnLayout>
  );
}