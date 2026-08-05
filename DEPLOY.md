# TheQuiverIndia — Production Deployment Guide (Vercel)

Your setup: domain in hand, Vercel account, **`main` branch auto-deploys to
Vercel**. That means: nothing merges to `main` until every step below is done —
a half-configured deploy would build a broken site.

Total cost: **₹0/month** (all free tiers). Total time: ~45–60 minutes.

---

## Step 1 — Neon (the production database, free)

Vercel is serverless: the local SQLite file cannot work there. Neon is free
managed Postgres.

1. Go to **neon.tech** → sign up (use your Google account) → **Create project**
   - Name: `thequiverindia` · Region: **AWS Asia Pacific (Singapore)** (closest to India)
2. On the project dashboard, copy the **connection string** (starts with
   `postgresql://…`). Choose the **pooled** connection string.
3. Keep it — this becomes `DATABASE_URI` in Step 5.

**Seed the production database from your machine** (one time):

```powershell
# in the project folder — temporarily point at Neon
$env:DATABASE_URI = "postgresql://…your-neon-string…"
npx tsx scripts/seed.ts            # all demo content, through the real pipeline
npx tsx scripts/update-settings.ts # your real social handles + channel ID
npx tsx scripts/sync-youtube.ts    # your 15 real videos
Remove-Item Env:DATABASE_URI       # back to local SQLite
```

(The first run also creates all tables. If you prefer to launch with an empty
site and write fresh articles in admin, skip the seed line.)

## Step 2 — Cloudflare R2 (image storage, free 10 GB)

Uploaded images can't live on Vercel's disk — R2 stores them.

1. **dash.cloudflare.com** → sign up → **R2 Object Storage** → *Create bucket*
   - Name: `thequiver-media` · Location: Asia-Pacific
2. Bucket → **Settings → Public access → Connect a custom domain** *or* enable
   the **r2.dev public URL** (fine to start).
3. R2 overview page → **Manage R2 API Tokens → Create API Token**
   - Permissions: *Object Read & Write*, scoped to this bucket
   - Copy: **Access Key ID**, **Secret Access Key**, and the
     **endpoint** shown (like `https://<accountid>.r2.cloudflarestorage.com`)

These become the four `S3_*` variables in Step 5.

## Step 3 — Google OAuth (reader sign-in, free)

Follow the section in **SETUP.md** ("Enable Google sign-in"). Two additions
for production, in the same OAuth client:

- Authorized JavaScript origins: `https://your-domain.in`
- Authorized redirect URIs: `https://your-domain.in/api/auth/callback/google`

When you're ready for the public (not just yourself) to sign in:
OAuth consent screen → **Publish app** (basic scopes need no review).

## Step 4 — generate two secrets

```powershell
node -e "console.log('PAYLOAD_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('AUTH_SECRET='    + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('CRON_SECRET='    + require('crypto').randomBytes(16).toString('hex'))"
```

## Step 5 — Vercel environment variables

Vercel → your project → **Settings → Environment Variables** → add each for
**Production** (and Preview if you want preview deploys to work):

| Variable | Value |
|---|---|
| `DATABASE_URI` | the Neon `postgresql://…` string |
| `PAYLOAD_SECRET` | from Step 4 |
| `AUTH_SECRET` | from Step 4 |
| `CRON_SECRET` | from Step 4 (protects the YouTube sync; Vercel Cron sends it automatically) |
| `AUTH_TRUST_HOST` | `true` |
| `AUTH_GOOGLE_ID` | from Step 3 |
| `AUTH_GOOGLE_SECRET` | from Step 3 |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.in` |
| `S3_BUCKET` | `thequiver-media` |
| `S3_ENDPOINT` | your R2 endpoint URL |
| `S3_ACCESS_KEY_ID` | from Step 2 |
| `S3_SECRET_ACCESS_KEY` | from Step 2 |
| `S3_REGION` | `auto` |

## Step 6 — domain

1. Vercel project → **Settings → Domains** → add `your-domain.in` (and `www`).
2. At your domain registrar, set the DNS records Vercel shows you
   (an `A` record to `76.76.21.21` or the given CNAME).
3. Wait for the ✓ (minutes to an hour). HTTPS is automatic.

Recommended (free, later): move DNS nameservers to Cloudflare for its CDN +
DDoS protection in front of Vercel.

## Step 7 — ship it

```bash
git checkout main
git merge phase-2-foundation
git push origin main
```

Vercel builds and deploys. Then verify, in order:

- [ ] `https://your-domain.in` — homepage with content
- [ ] `/admin` — **create your production admin user immediately** (first
      visitor to /admin claims it — do this right after deploy)
- [ ] Edit an article in admin → Publish → homepage updates in seconds
- [ ] Upload an image in admin → it appears (this proves R2)
- [ ] `/login` → Continue with Google → sign in works (proves OAuth)
- [ ] Save a bookmark, post a comment, approve it in admin, vote in a poll
- [ ] `/videos` — your channel's videos play
- [ ] `/sitemap.xml`, `/news-sitemap.xml`, `/feed.xml`, `/robots.txt`
- [ ] Share an article link in WhatsApp → branded headline card appears

## Step 8 — after launch (same day, 15 minutes)

1. **Google Search Console** (search.google.com/search-console) → add your
   domain → submit `sitemap.xml` **and** `news-sitemap.xml`.
2. **Vercel Cron** is already configured (`vercel.json`) — YouTube syncs daily
   at 09:00 IST. Check Vercel → project → Cron after the first day.
3. **Backups:** Neon keeps point-in-time history on the free tier. For an
   extra copy: Neon dashboard → your branch → *Restore* works to any point in
   the retention window. (Automated dumps to R2 come with the VPS phase.)
4. **Analytics (optional, free):** create a site at **cloud.umami.is** →
   set `NEXT_PUBLIC_UMAMI_SRC` + `NEXT_PUBLIC_UMAMI_ID` in Vercel env →
   redeploy. Privacy-first, no cookie banner needed.

## Known limits of the free tier (fine for launch)

- Vercel Hobby is not licensed for commercial use — upgrade to Pro ($20/mo)
  when you add ads/monetization, or move to the ~$5/mo VPS path (Docker
  setup is a planned follow-up).
- Cold starts: a rarely-visited page may take ~1–2s on first hit. The CDN
  cache hides this for all popular pages.
- Neon free tier sleeps after inactivity (first query wakes it, ~500ms).

---

## Maintenance gotchas (learned the hard way)

**After adding/removing any Payload plugin or rich-text feature, regenerate the
import map — with the same env the server will have:**

```powershell
$env:S3_BUCKET = "placeholder"   # makes the storage plugin register its component
npm run generate:importmap
Remove-Item Env:S3_BUCKET
```

The admin panel resolves its components through
`app/(payload)/admin/importMap.js`. In dev Payload resolves them dynamically, so
a stale map only breaks **production** — the symptom is a blank `/admin` screen
(the server log says *"You may need to run the payload generate:importmap
command"*). Commit the regenerated file.

**If images 404 on the live site**, the DB references files the bucket never
received. Repair, don't re-seed:

```powershell
npx tsx scripts/sync-media-to-r2.ts          # dry run
npx tsx scripts/sync-media-to-r2.ts --apply  # upload the missing ones
```

**`vercel-env.txt`** is a gitignored reference copy of the production values for
pasting into Vercel. It is deliberately *not* named `.env.production.local`,
because Next.js auto-loads that filename during `next build` — which would make
local production builds talk to the live database.

**Image hosts** must be whitelisted in `next.config.mjs` `remotePatterns`, or
`next/image` returns 400. YouTube uses `i.ytimg.com` *and* `i1`–`i4.ytimg.com`,
hence the `*.ytimg.com` wildcard.
