// next.config.mjs
/** @type {import("next").NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    typedRoutes: true,
    // Add improved memory management for blog content
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
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

      // GitHub
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },

      // Discord
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
      },
      {
        protocol: "https",
        hostname: "images.discordapp.net",
      },

      // Twitter
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
      },
      {
        protocol: "https",
        hostname: "abs.twimg.com",
      },

      // Facebook
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com",
      },
      {
        protocol: "https",
        hostname: "scontent.xx.fbcdn.net",
      },
      {
        protocol: "https",
        hostname: "scontent.fbom1-1.fna.fbcdn.net",
      },

      // LinkedIn
      {
        protocol: "https",
        hostname: "media.licdn.com",
      },

      // Additional
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
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [{ loader: "@svgr/webpack" }],
    });
    return config;
  },
  // Add error handling for build process
  onDemandEntries: {
    // Keep the page in memory for this many ms (default 15 seconds)
    maxInactiveAge: 60 * 1000,
    // Number of pages to keep in memory (default 5)
    pagesBufferLength: 5,
  },
  // Add custom headers for caching behavior
  async headers() {
    return [
      {
        source: "/blog/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=10, stale-while-revalidate=59",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
