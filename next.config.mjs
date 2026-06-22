import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true
  },
  turbopack: {
    root: path.resolve(process.cwd())
  }
};

export default nextConfig;
