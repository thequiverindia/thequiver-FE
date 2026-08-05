import { getArticles } from '@/lib/data';
import { SITE_NAME, SITE_URL } from '@/lib/site';

export const revalidate = 1800;

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** RSS 2.0 feed of the latest stories. */
export async function GET() {
  const { docs } = await getArticles({ limit: 20 });
  const items = docs
    .map(
      (a) => `    <item>
      <title>${esc(a.title)}</title>
      <link>${SITE_URL}/article/${encodeURIComponent(a.slug)}</link>
      <guid isPermaLink="true">${SITE_URL}/article/${encodeURIComponent(a.slug)}</guid>
      <description>${esc(a.excerpt)}</description>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
      <author>${esc(a.author.name)}</author>
      <category>${esc(a.categoryLabel ?? a.category)}</category>
    </item>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
    <description>Politics. Power. People. — India's editorial-first political news platform.</description>
    <language>en-IN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'content-type': 'application/rss+xml; charset=utf-8' },
  });
}
