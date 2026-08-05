/** Canonical site URL — set NEXT_PUBLIC_SITE_URL in production (your domain). */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://thequiverindia.in'
).replace(/\/$/, '');

export const SITE_NAME = 'TheQuiverIndia';
