import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.streamlinehq.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s2.coinmarketcap.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "arweave.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ipfs.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "static.jup.ag",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "github.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.arweave.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.ipfs.nftstorage.link",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "w3s.link",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.pinimg.com",
        port: "",
        pathname: "/**",
      },
    ],
    localPatterns: [
      {
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
