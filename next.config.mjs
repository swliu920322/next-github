/** @type {import('next').NextConfig} */
import { config } from './config.mjs';
import bundleAnalyzer from '@next/bundle-analyzer';

const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize';
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});
const scope = 'user';
const nextConfig = {
  // generateEtags: true,
  // onDemandEntries: {
  //   maxInactiveAge: 25 * 1000,
  //   pagesBufferLength: 2,
  // },
  env: {
    GITHUB_OAUTH_URL,
    OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${config.github.client_id}&scope=${scope}`,
    customKey: 'my-value',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
      },
    ],
  },
};

export default withBundleAnalyzer(nextConfig);
