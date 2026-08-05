/**
 * Reconcile media files into the R2 bucket.
 *
 *   npx tsx scripts/sync-media-to-r2.ts            # dry run (lists what it would do)
 *   npx tsx scripts/sync-media-to-r2.ts --apply    # actually upload
 *
 * Why this exists: the media *records* live in the database while the
 * *files* live in object storage. If a seed/import runs without storage
 * credentials active, the DB ends up referencing files the bucket never
 * received (broken images). This script repairs that by matching each
 * expected filename to the copy in ./media and uploading it. Idempotent —
 * it skips anything already present.
 *
 * Reads credentials from vercel-env.txt (or the environment).
 */
import fs from 'fs';
import path from 'path';
import {
  S3Client,
  HeadObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';

const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
};

function loadEnv(): Record<string, string> {
  const env: Record<string, string> = { ...(process.env as Record<string, string>) };
  const file = ['vercel-env.txt', '.env.production.local'].find((f) => fs.existsSync(f));
  if (file) {
    for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
      const m = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
      if (m && !line.trim().startsWith('#')) env[m[1]] ??= m[2];
    }
  }
  return env;
}

/**
 * Payload appends `-1`, `-2`… when a filename is already taken. The copy in
 * ./media may be under the un-suffixed name, so try both forms.
 */
function localCandidates(filename: string): string[] {
  const ext = path.extname(filename);
  const base = filename.slice(0, -ext.length);
  const out = [filename];
  const stripped = base.replace(/-\d+$/, '');
  if (stripped !== base) out.push(stripped + ext);
  const sized = /^(.*)-(\d+x\d+)$/.exec(base);
  if (sized) {
    const strippedName = sized[1].replace(/-\d+$/, '');
    out.push(`${strippedName}-${sized[2]}${ext}`);
  }
  return [...new Set(out)];
}

async function main() {
  const apply = process.argv.includes('--apply');
  const env = loadEnv();
  const siteUrl = (env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

  for (const key of ['S3_BUCKET', 'S3_ENDPOINT', 'S3_ACCESS_KEY_ID', 'S3_SECRET_ACCESS_KEY']) {
    if (!env[key]) throw new Error(`Missing ${key} (set it in vercel-env.txt or the environment)`);
  }

  const client = new S3Client({
    region: env.S3_REGION || 'auto',
    endpoint: env.S3_ENDPOINT,
    credentials: {
      accessKeyId: env.S3_ACCESS_KEY_ID,
      secretAccessKey: env.S3_SECRET_ACCESS_KEY,
    },
  });

  const res = await fetch(`${siteUrl}/api/media?limit=500&depth=0`);
  if (!res.ok) throw new Error(`Could not read media from ${siteUrl}: HTTP ${res.status}`);
  const { docs } = (await res.json()) as {
    docs: {
      filename?: string;
      sizes?: Record<string, { filename?: string } | undefined>;
    }[];
  };

  const expected: string[] = [];
  for (const doc of docs) {
    if (doc.filename) expected.push(doc.filename);
    for (const size of Object.values(doc.sizes ?? {})) {
      if (size?.filename) expected.push(size.filename);
    }
  }

  let uploaded = 0;
  let present = 0;
  const unresolved: string[] = [];

  for (const filename of [...new Set(expected)]) {
    // Already in the bucket?
    try {
      await client.send(
        new HeadObjectCommand({ Bucket: env.S3_BUCKET, Key: filename }),
      );
      present += 1;
      continue;
    } catch {
      // not present — upload it
    }

    const source = localCandidates(filename)
      .map((c) => path.join('media', c))
      .find((p) => fs.existsSync(p));
    if (!source) {
      unresolved.push(filename);
      continue;
    }

    if (apply) {
      await client.send(
        new PutObjectCommand({
          Bucket: env.S3_BUCKET,
          Key: filename,
          Body: fs.readFileSync(source),
          ContentType: MIME[path.extname(filename).toLowerCase()] ?? 'application/octet-stream',
        }),
      );
    }
    uploaded += 1;
  }

  console.log(
    `${apply ? 'Uploaded' : 'Would upload'}: ${uploaded} · already in bucket: ${present} · unresolved: ${unresolved.length}`,
  );
  unresolved.slice(0, 10).forEach((f) => console.log('  NO LOCAL COPY:', f));
  if (!apply && uploaded > 0) console.log('\nRe-run with --apply to perform the upload.');
}

main().catch((e) => {
  console.error('sync-media-to-r2 failed:', e instanceof Error ? e.message : e);
  process.exit(1);
});
