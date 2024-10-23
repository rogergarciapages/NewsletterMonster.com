// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  images: {
    domains: ["nlmr1.s3.eu-central-1.amazonaws.com"], // Added your S3 bucket domain
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