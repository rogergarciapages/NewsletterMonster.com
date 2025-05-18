import { MetadataRoute } from "next";

import { getPopularTags } from "@/lib/services/tags";
import { getAllCategoryData, getAllPostSlugs } from "@/lib/simple-mdx";

// Define base URL for production and development
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://newslettermonster.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Get all blog post slugs
    const posts = await getAllPostSlugs();
    const categories = await getAllCategoryData();
    const tags = await getPopularTags(50); // Get top 50 tags

    // Blog post URLs
    const blogPostUrls = posts.map(post => ({
      url: `${baseUrl}/blog/${post.params.category}/${post.params.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    // Category URLs
    const categoryUrls = categories.map(category => ({
      url: `${baseUrl}/blog/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    // Tag URLs
    const tagUrls = tags.map(tag => ({
      url: `${baseUrl}/tag/${tag.slug}`,
      lastModified: tag.updatedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    // Static Routes
    const staticRoutes = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1.0,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/trending`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/newsletters/explore`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/tag`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      },
    ];

    // Combine all routes
    return [...staticRoutes, ...categoryUrls, ...tagUrls, ...blogPostUrls];
  } catch (error) {
    console.error("Error generating sitemap:", error);

    // Return at least the static routes if there's an error
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1.0,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.9,
      },
    ];
  }
}
