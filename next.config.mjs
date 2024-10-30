// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  images: {
    domains: [
      // S3 bucket
      "nlmr1.s3.eu-central-1.amazonaws.com", "minio-l40s4ockokc8ggs04s4kkc4k.newslettermonster.com",
      
      // Google
      "lh3.googleusercontent.com",
      "lh4.googleusercontent.com",
      "lh5.googleusercontent.com",
      "lh6.googleusercontent.com",
      
      // GitHub
      "avatars.githubusercontent.com",
      "github.com",
      "raw.githubusercontent.com",
      
      // Discord
      "cdn.discordapp.com",
      "images.discordapp.net",
      
      // Twitter
      "pbs.twimg.com",
      "abs.twimg.com",
      
      // Facebook
      "platform-lookaside.fbsbx.com",
      "scontent.xx.fbcdn.net",
      "scontent.fbom1-1.fna.fbcdn.net",
      
      // LinkedIn
      "media.licdn.com",
      "platform-lookaside.fbsbx.com",
      
      // Additional common domains
      "img.clerk.com",  // If you're using Clerk
      "avatar.vercel.sh" // If you're using Vercel avatars
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [{ loader: "@svgr/webpack" }],
    });
    return config;
  },
};

export default nextConfig;