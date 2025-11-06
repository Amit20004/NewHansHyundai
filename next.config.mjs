/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export", // ✅ Required for cPanel static hosting

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["localhost", "res.cloudinary.com"],
  },
};

export default nextConfig;
