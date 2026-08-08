/**
 * Canonical site URL.
 *
 * Order of preference:
 *   1. NEXT_PUBLIC_SITE_URL (set this in Vercel)
 *   2. the production domain below
 *
 * A placeholder value is treated as unset — a mis-pasted env var previously
 * shipped "https://REPLACE-WITH-YOUR-DOMAIN" into the sitemap, RSS, robots.txt
 * and every og:image, so the code now refuses to trust obviously-wrong values.
 */
const PRODUCTION_URL = 'https://thequiverindia.com';

function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return PRODUCTION_URL;
  const looksUnconfigured =
    /replace|your-domain|example\.com|localhost:0/i.test(raw) ||
    !/^https?:\/\/[^\s.]+\.[^\s]+/.test(raw);
  if (looksUnconfigured) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `[site] NEXT_PUBLIC_SITE_URL="${raw}" looks unconfigured — falling back to ${PRODUCTION_URL}`,
      );
    }
    return PRODUCTION_URL;
  }
  return raw.replace(/\/$/, '');
}

export const SITE_URL = resolveSiteUrl();

export const SITE_NAME = 'TheQuiverIndia';

/** Absolute URL for a site-relative path (schema.org, RSS and OG need these). */
export function absoluteUrl(path: string): string {
  if (!path) return SITE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}
