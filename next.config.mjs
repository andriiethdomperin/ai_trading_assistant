/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    "http://localhost:3000", // Replace with your actual dev origin and port
    'http://192.168.147.35:3000', // Replace with your actual dev origin and port
    // Add more origins if needed
  ],
}

export default nextConfig
