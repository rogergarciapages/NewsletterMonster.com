// app/[brandname]/[newsletterId]/page.tsx
import ThreeColumnLayout from "@/app/components/layouts/three-column-layout";
import { prisma } from "@/lib/prisma-client";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

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
  
    return (
      <ThreeColumnLayout>
        <article className="max-w-3xl mx-auto px-4 py-8">
          <header className="mb-8">
            <Link
              href={`/${params.brandname}`}
              className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
            >
              ← Back to {params.brandname} newsletters
            </Link>
            
            <h1 className="text-4xl font-bold mb-4">
              {newsletter.subject || "Untitled Newsletter"}
            </h1>
            
            {newsletter.created_at && (
              <time className="text-gray-600" dateTime={newsletter.created_at.toISOString()}>
                {newsletter.created_at.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </time>
            )}
          </header>
  
          <div className="space-y-8">
            {newsletter.summary && (
              <div className="prose max-w-none bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Summary</h2>
                <p>{newsletter.summary}</p>
              </div>
            )}
  
            {newsletter.full_screenshot_url && (
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img
                  src={newsletter.full_screenshot_url}
                  alt={newsletter.subject || "Newsletter content"}
                  className="w-full h-auto"
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