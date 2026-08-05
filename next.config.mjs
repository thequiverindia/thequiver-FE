import { withPayload } from '@payloadcms/next/withPayload';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'avatar.vercel.sh' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // YouTube serves thumbnails from i.ytimg.com AND the numbered
      // mirrors i1–i4.ytimg.com, so the whole subdomain set must be allowed.
      { protocol: 'https', hostname: '*.ytimg.com' },
      { protocol: 'https', hostname: 'ytimg.com' },
    ],
  },
};

export default withPayload(nextConfig);
