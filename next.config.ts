import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "overfast-api.tekrop.fr",
      },
      {
        protocol: "https",
        hostname: "d15f34w2p8l1cc.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "static.playoverwatch.com",
      },
      {
        protocol: "https",
        hostname: "blz-contentstack-images.akamaized.net",
      },
    ],
  },
};

export default nextConfig;
