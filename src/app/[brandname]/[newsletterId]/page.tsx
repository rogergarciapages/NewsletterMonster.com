// app/[brandname]/[newsletterId]/page.tsx
import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";
import { prisma } from "@/lib/prisma-client";
import { Chip } from "@nextui-org/chip";
import { Tooltip } from "@nextui-org/react";
import { IconTagFilled, IconWindowMaximize } from "@tabler/icons-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import DynamicBackButton from "../../components/navigation/dynamic-back-button";
import PageNavigationTracker from "../../components/navigation/page-tracker";


type NewsletterDetail = {
  newsletter_id: number;
  user_id: string | null;
  sender: string | null;
  date: Date | null;
  subject: string | null;
  html_file_url: string | null;
  full_screenshot_url: string | null;
  top_screenshot_url: string | null;
  likes_count: number | null;
  you_rocks_count: number | null;
  created_at: Date | null;
  products_link: string | null;
  summary: string | null;
  tags: string | null;
  NewsletterTag: {
    Tag: {
      id: number;
      name: string;
    };
  }[];
}

export async function generateMetadata({ 
  params 
}: { 
  params: { brandname: string; newsletterId: string } 
}): Promise<Metadata> {
  try {
    const newsletter = await getNewsletter(params.newsletterId);
    
    if (!newsletter) {
      return {
        title: "Newsletter Not Found",
      };
    }

    return {
      title: newsletter.subject || "Newsletter",
      description: newsletter.summary || `Newsletter from ${newsletter.sender}`,
      openGraph: {
        title: newsletter.subject || "Newsletter",
        description: newsletter.summary || `Newsletter from ${newsletter.sender}`,
        ...(newsletter.top_screenshot_url && {
          images: [{ url: newsletter.top_screenshot_url }],
        }),
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Newsletter",
      description: "Newsletter details",
    };
  }
}

async function getNewsletter(newsletterId: string): Promise<NewsletterDetail | null> {
  if (!newsletterId || isNaN(Number(newsletterId))) {
    console.error("Invalid newsletter ID:", newsletterId);
    return null;
  }

  try {
    console.log("Attempting to fetch newsletter:", newsletterId);
    const newsletter = await prisma.newsletter.findUnique({
      where: {
        newsletter_id: parseInt(newsletterId),
      },
      select: {
        newsletter_id: true,
        user_id: true,
        sender: true,
        date: true,
        subject: true,
        html_file_url: true,
        full_screenshot_url: true,
        top_screenshot_url: true,
        likes_count: true,
        you_rocks_count: true,
        created_at: true,
        products_link: true,
        summary: true,
        tags: true,
        NewsletterTag: {
          select: {
            Tag: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!newsletter) {
      console.log("Newsletter not found:", newsletterId);
      return null;
    }

    console.log("Newsletter found:", newsletter.newsletter_id);
    return newsletter;
  } catch (error) {
    console.error("Error fetching newsletter:", error);
    return null;
  }
}

export default async function NewsletterPage({ 
    params 
  }: { 
    params: { brandname: string; newsletterId: string } 
  }) {
    console.log("Rendering newsletter page with params:", params);
    const newsletter = await getNewsletter(params.newsletterId);
  
    if (!newsletter) {
      console.log("Newsletter not found, returning 404");
      notFound();
    }
  
    const brandDisplayName = params.brandname.split("-").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  
    return (
      <ThreeColumnLayout>
        <PageNavigationTracker />
        <article className="max-w-3xl mx-auto px-4 py-8">
          <header className="mb-8 pb-4 border-b-5 border-torch-600">
            <DynamicBackButton 
              brandname={params.brandname}
              brandDisplayName={brandDisplayName}
            />
            
            <h1 className="text-4xl font-bold mb-4 tracking-tight">
              {newsletter.subject || "Untitled Newsletter"}
            </h1>
            
            <div className="space-y-2 text-[#111] text-[20px] leading-tight dark:text-white">
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-[auto,1fr] items-center gap-x-2">
                  <span className="font-light w-[110px]">Sender:</span>
                  <Link 
                    href={`/${params.brandname}`}
                    className="hover:text-torch-600 font-bold transition-colors flex items-center"
                  >
                    <Tooltip 
                      placement="right"
                      content="Check All Newsletters"
                      classNames={{
                        content: [
                          "py-2 px-4 shadow-xl",
                          "text-white bg-zinc-800",
                        ],
                      }}
                    >
                      {newsletter.sender}
                    </Tooltip>
                    <IconWindowMaximize className="ml-2" />
                  </Link>
                </div>
  
                {newsletter.created_at && (
                  <div className="grid grid-cols-[auto,1fr] items-center gap-x-2">
                    <span className="font-light w-[110px]">Date Sent:</span>
                    <time dateTime={newsletter.created_at.toISOString()}>
                      {newsletter.created_at.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </time>
                  </div>
                )}
              </div>
  
              {newsletter.NewsletterTag?.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-8">
                  {newsletter.NewsletterTag.map(({ Tag }) => (
                    <Chip
                      key={Tag.id}
                      variant="solid"
                      color="warning"
                      startContent={<IconTagFilled size={12} />}
                      className="text-sm"
                    >
                      {Tag.name}
                    </Chip>
                  ))}
                </div>
              )}
            </div>
          </header>
          
          <div className="space-y-8 mt-4">
            {newsletter.summary && (
              <div className="prose max-w-none rounded-lg">
                <h2 className="text-xl text-[#111] dark:text-white font-semibold mb-4">
                  Quick summary of this {brandDisplayName} newsletter
                </h2>
                <p className="text-[#111] dark:text-[#ccc]">{newsletter.summary}</p>
              </div>
            )}
  
            {newsletter.full_screenshot_url && (
              <div className="rounded-lg overflow-hidden shadow-lg relative aspect-auto">
                <Image
                  src={newsletter.full_screenshot_url}
                  alt={newsletter.subject || "Newsletter content"}
                  width={1200}
                  height={800}
                  className="w-full h-auto"
                  priority
                />
              </div>
            )}
  
            <div className="flex space-x-6 text-gray-600">
              {newsletter.likes_count !== null && (
                <div>
                  <span className="font-semibold">{newsletter.likes_count}</span> likes
                </div>
              )}
              {newsletter.you_rocks_count !== null && (
                <div>
                  <span className="font-semibold">{newsletter.you_rocks_count}</span> rocks
                </div>
              )}
            </div>
  
            {newsletter.html_file_url && (
              <div className="rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src={newsletter.html_file_url}
                  className="w-full h-screen"
                  title={newsletter.subject || "Newsletter content"}
                />
              </div>
            )}
  
            {newsletter.products_link && (
              <div className="mt-4">
                <a 
                  href={newsletter.products_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  View Products →
                </a>
              </div>
            )}
          </div>
        </article>
      </ThreeColumnLayout>
    );
  }