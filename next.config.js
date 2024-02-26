/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kbsc0vz82ntz1jwx.public.blob.vercel-storage.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        port: '',
      },
    ],
  },
}

module.exports = nextConfig
