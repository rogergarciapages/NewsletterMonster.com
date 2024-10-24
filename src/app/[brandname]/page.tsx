// app/[brandname]/page.tsx
import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";
import { prisma } from "@/lib/prisma-client";
import { IconHandLoveYou, IconHeartFilled, IconMailOpened } from "@tabler/icons-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BrandProfileHeader from "../components/brand-profile-header";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
      >
        {/* Image Section */}
        {newsletter.top_screenshot_url && (
  <Link href={`/${params.brandname}/${newsletter.newsletter_id}`}>
    <div className="relative w-full h-[400px] group"> {/* Added group class */}
      <div className="absolute inset-0 p-4">
        <div className="relative w-full h-full rounded-md overflow-hidden">
          <Image
            src={newsletter.top_screenshot_url || ""}
            alt={newsletter.subject || "Newsletter preview"}
            fill
            className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
          {/* Overlay with text and icon */}
          <div className="absolute inset-0 bg-torch-600/0 group-hover:bg-torch-600/90 transition-all duration-300 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex flex-col items-center gap-3">
              <IconMailOpened
 
                className="w-12 h-12 text-white" 
                strokeWidth={2}
              />
              <span className="text-white font-bold text-xl tracking-tight">
                Open it!
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Link>
)}
        
        {/* Content Section */}
        <div className="px-4 py-2 flex flex-col" style={{ height: "180px" }}>
          {/* Title */}
          <Link href={`/${params.brandname}/${newsletter.newsletter_id}`}>
            <h2 className="text-xl font-bold tracking-tight leading-[1em] mb-2 dark:text-white hover:text-torch-600 dark:hover:text-torch-600 transition-colors line-clamp-2">
              {newsletter.subject || "Untitled Newsletter"}
            </h2>
          </Link>

          {/* Bottom Content - Fixed to bottom */}
          <div className="flex flex-col mt-auto">
            {/* Summary */}
            {newsletter.summary && (
              <p className="text-gray-800 dark:text-gray-300 text-sm line-clamp-2 mb-3">
                {newsletter.summary}
              </p>
            )}

            {/* Metadata */}
            <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-2 pb-2">
  <div className="flex items-center gap-3">
    {newsletter.likes_count !== null && (
      <div className="flex items-center gap-1.5">
        <IconHeartFilled 
          size={24} 
          className="text-torch-700" 
        />
        <span className="font-medium text-medium text-gray-900 dark:text-white/80">{newsletter.likes_count}</span>
      </div>
    )}
    {newsletter.you_rocks_count !== null && (
      <div className="flex items-center gap-1.5">
        <IconHandLoveYou 
          size={24} 
          strokeWidth={2}
          className="text-gray-900 dark:text-white" 
        />
        <span className="font-medium text-medium text-gray-900 dark:text-white/80">{newsletter.you_rocks_count}</span>
      </div>
    )}
  </div>
  {newsletter.created_at && (
    <time 
      dateTime={newsletter.created_at.toISOString()}
      className="text-gray-500"
    >
      {new Date(newsletter.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      })}
    </time>
  )}
</div>
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