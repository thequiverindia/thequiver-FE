/**
 * Shortens any slug that is too long to be prerendered.
 *
 * A slug becomes a filename during the build and Linux caps filenames at 255
 * bytes; Devanagari costs 3 bytes per character, so long Hindi headlines
 * produced slugs that failed the Vercel build with ENAMETOOLONG. New slugs are
 * capped at source by slugify(); this fixes rows created before that.
 *
 * Run: npx tsx scripts/fix-long-slugs.ts        (report only)
 *      npx tsx scripts/fix-long-slugs.ts --write (apply)
 */
import { getPayload } from 'payload';
import config from '../payload.config';
import { slugify, isPrerenderableSlug, SLUG_MAX_BYTES } from '../collections/fields/slugField';

const COLLECTIONS = ['articles', 'fact-checks', 'leaders', 'polls', 'videos'] as const;

async function main() {
  const write = process.argv.includes('--write');
  const payload = await getPayload({ config });

  console.log(`Slug budget: ${SLUG_MAX_BYTES} bytes${write ? '' : '  (dry run — pass --write to apply)'}\n`);

  let total = 0;

  for (const collection of COLLECTIONS) {
    const res = await payload.find({ collection, limit: 1000, depth: 0, pagination: false });

    for (const doc of res.docs as Array<{ id: number | string; slug?: string; title?: string }>) {
      const slug = doc.slug;
      if (!slug || isPrerenderableSlug(slug)) continue;

      // slugify() applies the byte cap, cutting on a word boundary.
      let next = slugify(slug);

      // The slug field is unique — if the shortened form already exists on
      // another row, suffix it rather than failing the update.
      for (let n = 2; ; n++) {
        const clash = await payload.find({
          collection,
          where: { slug: { equals: next } },
          limit: 1,
          depth: 0,
        });
        const other = clash.docs[0] as { id?: number | string } | undefined;
        if (!other || String(other.id) === String(doc.id)) break;
        next = `${slugify(slug).slice(0, 60)}-${n}`;
      }

      total++;
      console.log(`${collection} #${doc.id}`);
      console.log(`  ${Buffer.byteLength(slug, 'utf8')}b  ${slug}`);
      console.log(`  ${Buffer.byteLength(next, 'utf8')}b  ${next}\n`);

      if (write) {
        await payload.update({
          collection,
          id: doc.id,
          data: { slug: next },
          // Keep published docs published — this is a URL fix, not an edit.
          draft: false,
          overrideAccess: true,
        });
      }
    }
  }

  if (total === 0) console.log('No over-long slugs found.');
  else console.log(write ? `Updated ${total} slug(s).` : `${total} slug(s) would change.`);

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
