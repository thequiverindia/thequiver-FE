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
