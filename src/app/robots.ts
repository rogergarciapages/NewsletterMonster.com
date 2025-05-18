import { MetadataRoute } from "next";

// Define base URL for production and development
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://newslettermonster.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/*", "/auth/*"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
