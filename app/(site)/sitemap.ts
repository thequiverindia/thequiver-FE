import type { MetadataRoute } from 'next';
import { getPayload } from 'payload';
import config from '@payload-config';
import { SITE_URL } from '@/lib/site';

export const revalidate = 3600;

const STATIC_ROUTES = [
  '',
  '/news',
  '/politics',
  '/elections',
  '/opinion',
  '/explainers',
  '/fact-check',
  '/leader',
  '/videos',
  '/polls',
  '/state-news',
  '/international',
  '/trending',
  '/about',
  '/contact',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === '' ? 'hourly' : 'daily',
    priority: path === '' ? 1 : 0.7,
  }));

  try {
    const payload = await getPayload({ config });
    const collections = [
      { slug: 'articles' as const, path: '/article', published: true },
      { slug: 'fact-checks' as const, path: '/fact-check', published: true },
      { slug: 'leaders' as const, path: '/leader', published: false },
      { slug: 'videos' as const, path: '/videos', published: false },
      { slug: 'polls' as const, path: '/polls', published: false },
    ];
    for (const c of collections) {
      const res = await payload.find({
        collection: c.slug,
        where: c.published ? { _status: { equals: 'published' } } : undefined,
        limit: 1000,
        depth: 0,
        select: { slug: true, updatedAt: true },
      });
      for (const doc of res.docs) {
        const d = doc as { slug?: string; updatedAt?: string };
        if (!d.slug) continue;
        entries.push({
          url: `${SITE_URL}${c.path}/${encodeURIComponent(d.slug)}`,
          lastModified: d.updatedAt ? new Date(d.updatedAt) : undefined,
          changeFrequency: 'weekly',
          priority: c.slug === 'articles' ? 0.9 : 0.6,
        });
      }
    }
  } catch {
    // Empty DB (e.g. CI) — static routes alone are a valid sitemap.
  }

  return entries;
}
