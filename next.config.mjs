// next.config.mjs
/** @type {import("next").NextConfig} */
const nextConfig = {
  // Set output to standalone for better deployment compatibility
  output: "standalone",

  // Improve production performance with these settings
  poweredByHeader: false,
  reactStrictMode: true,

  // Ignore build errors for typescript and eslint during production compilation
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Experimental features
  experimental: {
    typedRoutes: false,
  },

  // Note: Sitemap and robots.txt are automatically generated at build time
  // via App Router Route Handlers in src/app/sitemap.ts and src/app/robots.ts

  // Image configuration
  images: {
    remotePatterns: [
      // S3 bucket
      {
        protocol: "https",
        hostname: "nlmr1.s3.eu-central-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "minio-zok40c4wo8s88cks0cwc0kkk.newslettermonster.com",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
      // Google
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh4.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh5.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh6.googleusercontent.com",
      },
      // Additional hostnames (keeping only a subset for brevity)
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "avatar.vercel.sh",
      },
    ],
  },

  // SVG processing configuration
  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg'),
    );

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule?.issuer,
        resourceQuery: { not: [...(fileLoaderRule?.resourceQuery?.not || []), /url/] },
        use: [{ loader: '@svgr/webpack', options: { icon: true } }],
      },
    );

    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    return config;
  },
};

export default nextConfig;
