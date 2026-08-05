import { revalidateTag } from 'next/cache';
import { getPayload } from 'payload';
import config from '@payload-config';
import { syncYouTube } from '@/lib/sync-youtube';

/**
 * Cron endpoint for the daily YouTube sync (e.g. Vercel Cron, or curl from
 * a VPS crontab). Protected by CRON_SECRET when set:
 *   curl -H "Authorization: Bearer $CRON_SECRET" https://site/api/sync-youtube
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get('authorization') !== `Bearer ${secret}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const payload = await getPayload({ config });
    const result = await syncYouTube(payload);
    if (result.created > 0) revalidateTag('videos');
    return Response.json(result);
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : 'sync failed' },
      { status: 500 },
    );
  }
}
