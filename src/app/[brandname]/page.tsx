// app/[brandname]/page.tsx
import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";
import { prisma } from "@/lib/prisma-client";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type BrandNewsletter = {
  newsletter_id: number;
  sender: string | null;
  subject: string | null;
  top_screenshot_url: string | null;
  likes_count: number | null;
  you_rocks_count: number | null;
  created_at: Date | null;
  summary: string | null;
}

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

async function getBrandNewsletters(brandname: string): Promise<BrandNewsletter[]> {
  try {
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
      },
    });

    if (!newsletters.length) {
      return [];
    }

    return newsletters;
  } catch (error) {
    console.error("Error fetching brand newsletters:", error);
    throw new Error("Failed to fetch brand newsletters");
  }
}

export default async function BrandPage({ 
  params 
}: { 
  params: { brandname: string } 
}) {
  const newsletters = await getBrandNewsletters(params.brandname);
  const brandDisplayName = params.brandname.split("-").map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(" ");

  if (!newsletters.length) {
    notFound();
  }

  return (
    <ThreeColumnLayout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{brandDisplayName}</h1>
          <p className="text-gray-600">
            {newsletters.length} {newsletters.length === 1 ? "newsletter" : "newsletters"} available
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6">
          {newsletters.map((newsletter) => (
            <article 
              key={newsletter.newsletter_id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {newsletter.top_screenshot_url && (
                <div className="relative aspect-video">
                  <img
                    src={newsletter.top_screenshot_url}
                    alt={newsletter.subject || "Newsletter preview"}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">
                  <Link 
                    href={`/${params.brandname}/${newsletter.newsletter_id}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {newsletter.subject || "Untitled Newsletter"}
                  </Link>
                </h2>

                {newsletter.summary && (
                  <p className="text-gray-600 mb-4 line-clamp-3">{newsletter.summary}</p>
                )}

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  {newsletter.created_at && (
                    <time dateTime={newsletter.created_at.toISOString()}>
                      {newsletter.created_at.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </time>
                  )}
                  {newsletter.likes_count !== null && (
                    <span>{newsletter.likes_count} likes</span>
                  )}
                  {newsletter.you_rocks_count !== null && (
                    <span>{newsletter.you_rocks_count} rocks</span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </ThreeColumnLayout>
  );
}