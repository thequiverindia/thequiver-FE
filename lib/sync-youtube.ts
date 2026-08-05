import type { Payload } from 'payload';
import { slugify } from '@/collections/fields/slugField';

/**
 * YouTube channel sync — no API key needed.
 *
 * Reads the channel's public RSS feed (latest ~15 uploads) and creates a
 * Video doc for anything not seen before. Runs daily via cron (or manually
 * with `npm run sync:youtube`). The channel ID comes from Settings →
 * socials → youtubeChannelId, so changing channels never touches code.
 */

const FEED_URL = (channelId: string) =>
  `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

type FeedEntry = {
  videoId: string;
  title: string;
  published: string;
  description: string;
  thumbnail: string;
};

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export function parseFeed(xml: string): FeedEntry[] {
  const entries: FeedEntry[] = [];
  for (const m of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
    const block = m[1];
    const videoId = block.match(/<yt:videoId>([^<]+)/)?.[1];
    const title = block.match(/<title>([^<]*)/)?.[1];
    if (!videoId || !title) continue;
    entries.push({
      videoId,
      title: decodeEntities(title).trim(),
      published: block.match(/<published>([^<]+)/)?.[1] ?? new Date().toISOString(),
      description: decodeEntities(
        block.match(/<media:description>([\s\S]*?)<\/media:description>/)?.[1] ?? '',
      )
        .trim()
        .slice(0, 500),
      thumbnail:
        block.match(/<media:thumbnail url="([^"]+)"/)?.[1] ??
        `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    });
  }
  return entries;
}

export async function syncYouTube(payload: Payload): Promise<{
  checked: number;
  created: number;
  channelId: string | null;
}> {
  const settings = await payload.findGlobal({ slug: 'settings' });
  const channelId =
    settings?.socials?.youtubeChannelId || process.env.YOUTUBE_CHANNEL_ID || null;
  if (!channelId) {
    payload.logger.warn(
      'YouTube sync skipped: no channel ID in Settings → socials → youtubeChannelId',
    );
    return { checked: 0, created: 0, channelId: null };
  }

  const res = await fetch(FEED_URL(channelId), {
    signal: AbortSignal.timeout(20000),
    headers: { 'user-agent': 'TheQuiverIndia-sync/1.0' },
  });
  if (!res.ok) throw new Error(`YouTube feed returned ${res.status}`);
  const entries = parseFeed(await res.text());

  let created = 0;
  for (const e of entries) {
    const existing = await payload.find({
      collection: 'videos',
      where: { youtubeId: { equals: e.videoId } },
      limit: 1,
      depth: 0,
    });
    if (existing.totalDocs > 0) continue;

    let slug = slugify(e.title).slice(0, 80);
    if (!slug) slug = `video-${e.videoId.toLowerCase()}`;
    const slugTaken = await payload.find({
      collection: 'videos',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    });
    if (slugTaken.totalDocs > 0) slug = `${slug}-${e.videoId.slice(0, 4).toLowerCase()}`;

    await payload.create({
      collection: 'videos',
      data: {
        title: e.title,
        slug,
        youtubeId: e.videoId,
        description: e.description,
        thumbnailUrl: e.thumbnail,
        publishedAt: e.published,
        source: 'youtube',
      },
      context: { disableRevalidate: true },
    });
    created += 1;
  }

  payload.logger.info(`YouTube sync: ${entries.length} in feed, ${created} new`);
  return { checked: entries.length, created, channelId };
}
