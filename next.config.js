/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
  env: {
    BACKEND_URL: process.env.BACKEND_URL,
    WORDPRESS_USERNAME: process.env.WORDPRESS_USERNAME,
    APPLICATION_PASSWORD: process.env.APPLICATION_PASSWORD,
    JWT_SECRET: process.env.JWT_SECRET,
  },
}

module.exports = nextConfig
