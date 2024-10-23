// app/[brandname]/page.tsx
import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";
import { prisma } from "@/lib/prisma-client";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BrandProfileHeader from "../components/brand-profile-header";

type BrandNewsletter = {
  newsletter_id: number;
  sender: string | null;
  subject: string | null;
  top_screenshot_url: string | null;
  likes_count: number | null;
  you_rocks_count: number | null;
  created_at: Date | null;
  summary: string | null;
  user_id: string | null;
};

export async function generateMetadata({ 
  params 
}: { 
  params: { brandname: string } 
}): Promise<Metadata> {
  const displayName = params.brandname.split("-").map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(" ");

  return {
    title: `${displayName} Newsletters | Your Platform Name`,
    description: `Browse all newsletters from ${displayName}. Get the latest updates and insights.`,
  };
}

async function getBrandData(brandname: string) {
  try {
    // Get newsletters
    const newsletters = await prisma.newsletter.findMany({
      where: {
        sender: {
          contains: brandname.replace(/-/g, " "),
          mode: "insensitive",
        },
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

    // Get user data if the profile is claimed
    let user = null;
    const claimedNewsletter = newsletters.find(n => n.user_id);
    if (claimedNewsletter?.user_id) {
      user = await prisma.user.findUnique({
        where: {
          user_id: claimedNewsletter.user_id
        }
      });
    }

    // Get followers count if the profile is claimed
    let followersCount = 0;
    if (user) {
      followersCount = await prisma.follower.count({
        where: {
          user_id: user.user_id
        }
      });
    }

    return {
      newsletters,
      user,
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
  const brandDisplayName = params.brandname.split("-").map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(" ");

  return (
    <ThreeColumnLayout>
      <div className="w-ful text-[#111]">
        <BrandProfileHeader 
          brandName={brandDisplayName}
          user={user}
          newsletterCount={newsletters.length}
          followersCount={followersCount}
        />
        
        <div className="max-w-6xl mx-auto px-1 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {newsletters.map((newsletter) => (
              <article 
                key={newsletter.newsletter_id}
                className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {newsletter.top_screenshot_url && (
                  <Link href={`/${params.brandname}/${newsletter.newsletter_id}`}>
                    <div className="relative aspect-video">
                      <img
                        src={newsletter.top_screenshot_url}
                        alt={newsletter.subject || "Newsletter preview"}
                        className="w-full h-full object-cover rounded-xl p-4 min-h-[400px] object-top"
                      />
                    </div>
                  </Link>
                )}
                
                <div className="p-4">
                  <Link href={`/${params.brandname}/${newsletter.newsletter_id}`}>
                    <h2 className="text-xl font-bold tracking-tight leading-[1em] mb-2 dark:text-white hover:text-torch-600 dark:hover:text-torch-600 transition-colors">
                      {newsletter.subject || "Untitled Newsletter"}
                    </h2>
                  </Link>

                  {newsletter.summary && (
                    <p className="text-gray-800 dark:text-gray-300 align-bottom text-sm mb-4 line-clamp-3">
                      {newsletter.summary}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      {newsletter.likes_count !== null && (
                        <span>{newsletter.likes_count} likes</span>
                      )}
                      {newsletter.you_rocks_count !== null && (
                        <span>{newsletter.you_rocks_count} rocks</span>
                      )}
                    </div>
                    {newsletter.created_at && (
                      <time dateTime={newsletter.created_at.toISOString()}>
                        {new Date(newsletter.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </time>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </ThreeColumnLayout>
  );
}