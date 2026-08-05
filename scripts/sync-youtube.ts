/** Manual/cron entry point: npm run sync:youtube */
import { getPayload } from 'payload';
import config from '../payload.config';
import { syncYouTube } from '../lib/sync-youtube';

async function main() {
  const payload = await getPayload({ config });
  const result = await syncYouTube(payload);
  console.log(
    `Done — channel ${result.channelId ?? '(none)'}: ${result.checked} in feed, ${result.created} created`,
  );
  process.exit(0);
}

main().catch((e) => {
  console.error('YouTube sync failed:', e);
  process.exit(1);
});
