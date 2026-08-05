/** One-off: write the real social handles into the Settings global. */
import { getPayload } from 'payload';
import config from '../payload.config';

async function main() {
  const payload = await getPayload({ config });
  await payload.updateGlobal({
    slug: 'settings',
    data: {
      siteName: 'TheQuiverIndia',
      tagline: 'Politics. Power. People.',
      socials: {
        instagram: 'the_quiver_hindi',
        youtube: '@thequiverhindi',
        youtubeChannelId: 'UCBoUqEttVTZFi1ceEx4tiHw',
        x: 'TheQuiverhindi',
        facebook: 'https://www.facebook.com/share/1DjWWNVWKr/',
      },
    },
    context: { disableRevalidate: true },
  });
  console.log('Settings updated with real handles');
  process.exit(0);
}
main().catch((e) => { console.error(e); process.exit(1); });
