/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    RAPIDAPI_TOKEN: process.env.RAPIDAPI_TOKEN,
  },
};

module.exports = nextConfig;
