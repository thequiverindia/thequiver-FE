import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig } from 'payload';
import { sqliteAdapter } from '@payloadcms/db-sqlite';
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
    Users,
    Media,
  ],
  globals: [Settings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'dev-only-secret-change-in-production',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      // SQLite for local dev; DATABASE_URI switches to Postgres (Neon)
      // for staging/production via the postgres adapter.
      url: process.env.DATABASE_URI || 'file:./thequiver-dev.db',
    },
  }),
  sharp,
});
