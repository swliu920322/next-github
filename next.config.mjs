/** @type {import('next').NextConfig} */
import { config } from './config.mjs'
const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize';
const scope = 'user'
const nextConfig = {
  // generateEtags: true,
  // onDemandEntries: {
  //   maxInactiveAge: 25 * 1000,
  //   pagesBufferLength: 2,
  // },
  env: {
    GITHUB_OAUTH_URL,
    OAUTH_URL:  `${GITHUB_OAUTH_URL}?client_id=${config.github.client_id}&scope=${scope}`,
    customKey: 'my-value',
  },
};

export default nextConfig;
