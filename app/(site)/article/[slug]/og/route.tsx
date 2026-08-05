import { ImageResponse } from 'next/og';
import { getArticleBySlug } from '@/lib/data';

export const revalidate = 3600;

/**
 * Branded headline card for link previews (WhatsApp, Instagram DMs, X…).
 * Served at /article/<slug>/og and referenced from the article's metadata.
 */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> },
) {
  const { slug } = await ctx.params;
  const article = await getArticleBySlug(decodeURIComponent(slug));
  const title = article?.title ?? 'TheQuiverIndia';
  const kicker = article?.kicker ?? article?.categoryLabel ?? 'News';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
          padding: 72,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#FBBF24',
            fontSize: 26,
            letterSpacing: 5,
            textTransform: 'uppercase',
            fontFamily: 'Arial, sans-serif',
            fontWeight: 700,
          }}
        >
          <span>TheQuiverIndia</span>
          <span style={{ color: 'rgba(255,255,255,0.6)', letterSpacing: 2 }}>{kicker}</span>
        </div>
        <div
          style={{
            color: '#FFFFFF',
            fontSize: title.length > 90 ? 52 : 64,
            fontWeight: 700,
            lineHeight: 1.15,
            fontFamily: 'Georgia, serif',
            display: 'flex',
          }}
        >
          {title.length > 140 ? `${title.slice(0, 140)}…` : title}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            color: 'rgba(255,255,255,0.7)',
            fontSize: 26,
            fontFamily: 'Arial, sans-serif',
          }}
        >
          <div style={{ width: 56, height: 6, background: '#FBBF24', display: 'flex' }} />
          <span>Politics. Power. People.</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
