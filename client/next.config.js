/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcLoaderOptions: {
    topLevelAwait: true,
  },
};

module.exports = nextConfig;
