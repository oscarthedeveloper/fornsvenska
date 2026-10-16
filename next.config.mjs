/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      "/ordbok": ["./data/ordbok/**/*", "./data/ordbok-rattelser.json"],
      "/ordbok/[id]": ["./data/ordbok/**/*", "./data/ordbok-rattelser.json"],
      "/api/ordbok/uppslag": ["./data/ordbok/**/*", "./data/ordbok-rattelser.json"],
      "/texter/[[...slug]]": ["./data/ordbok/**/*", "./data/ordbok-rattelser.json"],
    },
  },
};

export default nextConfig;
