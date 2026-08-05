import { getArticles } from '@/lib/data';
import { SITE_NAME, SITE_URL } from '@/lib/site';

export const revalidate = 900;

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Google News sitemap — only stories from the last 48 hours qualify.
 * Submit alongside sitemap.xml in Search Console for Google News/Discover.
 */
export async function GET() {
  const { docs } = await getArticles({ limit: 100 });
  const cutoff = Date.now() - 48 * 60 * 60 * 1000;
  const fresh = docs.filter((a) => new Date(a.publishedAt).getTime() > cutoff);

  const urls = fresh
    .map(
      (a) => `  <url>
    <loc>${SITE_URL}/article/${encodeURIComponent(a.slug)}</loc>
    <news:news>
      <news:publication>
        <news:name>${esc(SITE_NAME)}</news:name>
        <news:language>${a.language === 'hi' ? 'hi' : 'en'}</news:language>
      </news:publication>
      <news:publication_date>${new Date(a.publishedAt).toISOString()}</news:publication_date>
      <news:title>${esc(a.title)}</news:title>
    </news:news>
  </url>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: { 'content-type': 'application/xml; charset=utf-8' },
  });
}
