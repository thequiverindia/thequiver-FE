import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig } from 'payload';
import { sqliteAdapter } from '@payloadcms/db-sqlite';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { s3Storage } from '@payloadcms/storage-s3';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import sharp from 'sharp';

import { Users } from './collections/Users';
import { Media } from './collections/Media';
import { Articles } from './collections/Articles';
import { Authors } from './collections/Authors';
import { Categories } from './collections/Categories';
import { Tags } from './collections/Tags';
import { FactChecks } from './collections/FactChecks';
import { Leaders } from './collections/Leaders';
import { Parties } from './collections/Parties';
import { Polls } from './collections/Polls';
import { Videos } from './collections/Videos';
import { Readers } from './collections/Readers';
import { Comments } from './collections/Comments';
import { Bookmarks } from './collections/Bookmarks';
import { PollVotes } from './collections/PollVotes';
import { Waitlist } from './collections/Waitlist';
import { Submissions } from './collections/Submissions';
import { Settings } from './globals/Settings';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' · TheQuiverIndia Admin',
    },
  },
  collections: [
    Articles,
    FactChecks,
    Videos,
    Authors,
    Categories,
    Tags,
    Leaders,
    Parties,
    Polls,
    Comments,
    Readers,
    Bookmarks,
    PollVotes,
    Waitlist,
    Submissions,
    Users,
    Media,
  ],
  globals: [Settings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'dev-only-secret-change-in-production',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // SQLite locally (zero setup), Neon Postgres in production — chosen purely
  // by what DATABASE_URI looks like. Same schema, same code.
  db: (process.env.DATABASE_URI ?? '').startsWith('postgres')
    ? postgresAdapter({
        pool: { connectionString: process.env.DATABASE_URI },
      })
    : sqliteAdapter({
        client: { url: process.env.DATABASE_URI || 'file:./thequiver-dev.db' },
      }),
  // Media on Cloudflare R2 (S3-compatible) when configured; local disk otherwise.
  // Vercel's filesystem is ephemeral, so R2 is required in production.
  plugins: process.env.S3_BUCKET
    ? [
        s3Storage({
          collections: { media: true },
          bucket: process.env.S3_BUCKET,
          config: {
            endpoint: process.env.S3_ENDPOINT,
            region: process.env.S3_REGION || 'auto',
            credentials: {
              accessKeyId: process.env.S3_ACCESS_KEY_ID ?? '',
              secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? '',
            },
          },
        }),
      ]
    : [],
  sharp,
});
