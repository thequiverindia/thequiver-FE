/**
 * Removes the placeholder videos created by the original seed (they have a
 * fake `seed-placeholder-N` id, cannot play, and show "arriving soon" to
 * readers). Real synced videos are untouched.
 *
 *   npx tsx scripts/cleanup-seed-videos.ts          # dry run
 *   npx tsx scripts/cleanup-seed-videos.ts --apply
 */
import { getPayload } from 'payload';
import config from '../payload.config';

async function main() {
  const apply = process.argv.includes('--apply');
  const payload = await getPayload({ config });
  const res = await payload.find({
    collection: 'videos',
    where: { youtubeId: { like: 'seed-placeholder' } },
    limit: 100,
    depth: 0,
  });
  console.log(`${apply ? 'Deleting' : 'Would delete'} ${res.totalDocs} placeholder video(s):`);
  for (const v of res.docs) {
    console.log('  -', v.title.slice(0, 60));
    if (apply) {
      await payload.delete({
        collection: 'videos',
        id: v.id,
        context: { disableRevalidate: true },
      });
    }
  }
  if (!apply && res.totalDocs > 0) console.log('\nRe-run with --apply to delete.');
  process.exit(0);
}
main().catch((e) => { console.error(e); process.exit(1); });
