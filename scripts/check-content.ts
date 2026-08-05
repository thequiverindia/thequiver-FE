/** Quick content sanity check: prints doc counts per collection. */
import { getPayload } from 'payload';
import config from '../payload.config';

const collections = [
  'articles',
  'fact-checks',
  'leaders',
  'parties',
  'polls',
  'videos',
  'authors',
  'tags',
  'categories',
  'media',
  'users',
] as const;

async function main() {
  const payload = await getPayload({ config });
  for (const c of collections) {
    const { totalDocs } = await payload.count({ collection: c });
    console.log(`${c.padEnd(12)} ${totalDocs}`);
  }
  const one = await payload.find({ collection: 'articles', limit: 1, depth: 1 });
  const a = one.docs[0];
  if (a) {
    console.log('\nSample article:', a.title);
    console.log('  slug:', a.slug, '| status:', a._status, '| readMinutes:', a.readMinutes);
    console.log('  category:', typeof a.category === 'object' ? a.category?.label : a.category);
    console.log('  author:', typeof a.author === 'object' ? a.author?.name : a.author);
    console.log('  heroImage:', typeof a.heroImage === 'object' ? a.heroImage?.url : a.heroImage);
  }
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
