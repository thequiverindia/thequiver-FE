# TheQuiverIndia — Setup Guide (Phase 2)

## Run locally (works today, $0)

```bash
npm install
npm run dev          # site at http://localhost:3000, admin at http://localhost:3000/admin
```

First visit to `/admin` asks you to **create the first admin user** — that
account owns the panel. Local data lives in `thequiver-dev.db` (SQLite,
gitignored); media uploads land in `/media` (gitignored).

Useful commands:

```bash
npm run generate:types      # regenerate payload-types.ts after schema changes
npm run generate:importmap  # regenerate admin import map after adding custom components
npm run build               # production build (site + admin)
```

## Environment variables (`.env`)

| Variable | Dev value | Production value |
|---|---|---|
| `PAYLOAD_SECRET` | any string | long random string — generate with `openssl rand -hex 32` |
| `DATABASE_URI` | `file:./thequiver-dev.db` | Neon Postgres connection string |

## Enable Google sign-in (free, ~10 minutes, needed for reader accounts)

Reader features (bookmarks, comments, poll voting) need Google OAuth keys:

1. Go to **console.cloud.google.com** → create a project (e.g. "TheQuiverIndia").
2. **APIs & Services → OAuth consent screen** → External → fill app name
   "TheQuiverIndia", your email → save (stay in "Testing" mode for now and add
   your own Gmail as a test user).
3. **APIs & Services → Credentials → Create credentials → OAuth client ID** →
   Application type **Web application**:
   - Authorized JavaScript origins: `http://localhost:3000` (add the real
     domain later)
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
     (later also `https://your-domain/api/auth/callback/google`)
4. Copy the **Client ID** and **Client secret** into `.env`:

   ```
   AUTH_GOOGLE_ID=xxxxx.apps.googleusercontent.com
   AUTH_GOOGLE_SECRET=xxxxx
   ```

5. Restart `npm run dev` → the "Continue with Google" button on `/login` works.
   Until then the login page shows a friendly "not configured yet" notice.

## Accounts you (the owner) need to create — all free tiers

These are needed when we deploy staging/production, not for local work:

1. **GitHub** — push this repo (CI in `.github/workflows/ci.yml` runs automatically).
2. **Neon** (neon.tech) — free Postgres. Create a project, copy the connection
   string into `DATABASE_URI`. (We then switch the db adapter to
   `@payloadcms/db-postgres` — one line in `payload.config.ts`.)
3. **Cloudflare** (cloudflare.com) — free plan for DNS/CDN, plus an **R2**
   bucket for media uploads (10 GB free).
4. **Vercel** (vercel.com) — free Hobby deploys for the beta; or skip and use
   the $5/mo VPS path at launch (Docker setup comes in a later milestone).

## Deliberately NOT configured (per project decisions)

- No email service (no sending anywhere in v1)
- No live/breaking-news features
- No paid services of any kind
