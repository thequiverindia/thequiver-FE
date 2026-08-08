# Vercel Environment Variables

Every value the deployed site needs. **This file deliberately contains no
secrets** — it is committed to a GitHub repo. The real values live in
`vercel-env.txt` in the project root, which is gitignored.

Set these at **Vercel → your project → Settings → Environment Variables**.

---

## Fix this one first

`NEXT_PUBLIC_SITE_URL` is currently set to a placeholder
(`https://REPLACE-WITH-YOUR-DOMAIN`). That single wrong value broke every image
on the site, because Payload stamped it onto every media URL.

**Set it to exactly:**

```
https://thequiverindia.com
```

No trailing slash. The code no longer trusts this variable blindly, but it is a
`NEXT_PUBLIC_` variable — it gets inlined into the JavaScript sent to browsers —
so a wrong value can still surface in ways that are hard to trace.

---

## The full list

Copy each value from `vercel-env.txt`. Apply all of them to **Production**,
**Preview** and **Development** unless noted.

### Site identity

| Variable | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://thequiverindia.com` | No trailing slash. Public — never put a secret here. |
| `AUTH_URL` | `https://thequiverindia.com` | Pins the OAuth callback. Without it, Auth.js uses whatever host served the request, so signing in from a `*.vercel.app` preview URL fails with `redirect_uri_mismatch`. |
| `AUTH_TRUST_HOST` | `true` | Required when running behind Vercel's proxy. |

### Database — Neon

| Variable | Where it comes from |
|---|---|
| `DATABASE_URI` | Neon → your project → Connection string (pooled). Must keep `?sslmode=require`. |

The code picks its database adapter from this value: anything starting with
`postgres` uses Neon, otherwise it falls back to local SQLite. So this must be
set in production or the site silently runs on a database that isn't there.

### Media storage — Cloudflare R2

| Variable | Where it comes from |
|---|---|
| `S3_BUCKET` | R2 bucket name |
| `S3_ENDPOINT` | R2 → bucket → Settings → S3 API endpoint (`https://<account-id>.r2.cloudflarestorage.com`) |
| `S3_ACCESS_KEY_ID` | R2 → Manage API Tokens |
| `S3_SECRET_ACCESS_KEY` | Shown **once** when the token is created |
| `S3_REGION` | `auto` |

If `S3_BUCKET` is unset, the app writes uploads to local disk — and Vercel's
filesystem is wiped on every deploy, so uploaded images would vanish. It is
effectively required in production.

### Google sign-in (readers only)

| Variable | Where it comes from |
|---|---|
| `AUTH_GOOGLE_ID` | Google Cloud Console → Credentials → OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Same screen, client secret |
| `AUTH_SECRET` | Random 32+ byte string. Generate with `openssl rand -base64 32`. Changing it signs every reader out. |

In Google Cloud Console → Credentials → your OAuth client, the
**Authorised redirect URI** must be exactly:

```
https://thequiverindia.com/api/auth/callback/google
```

This is reader login for the public site. Admin login at `/admin` is a separate
email-and-password system and does not use Google.

### Payload CMS

| Variable | Notes |
|---|---|
| `PAYLOAD_SECRET` | Random 32+ byte string. **Changing it invalidates every admin session and breaks existing encrypted fields — set it once and leave it.** |

### Cron

| Variable | Notes |
|---|---|
| `CRON_SECRET` | Random string. Vercel sends it as a Bearer token to `/api/sync-youtube`; the route returns 401 without it, which is what keeps the endpoint from being publicly triggerable. |

The schedule itself lives in `vercel.json`, not in env (daily at 03:30 UTC).

---

## Applying a change

Environment variables are **baked in at build time**. Editing one in the
dashboard does nothing to the running site until you rebuild:

1. Settings → Environment Variables → edit → Save
2. Deployments → latest → ⋯ → **Redeploy**
3. Leave "Use existing Build Cache" **unchecked**

---

## Also still outstanding

**Add `www` as a domain.** `https://www.thequiverindia.com` currently serves a
certificate issued for the bare domain, so it fails with a security warning.
Phones autocomplete `www.` far more often than desktops do, which is the main
reason admin login looked broken specifically on mobile.

Vercel → Settings → Domains → add `www.thequiverindia.com` → set it to redirect
to `thequiverindia.com`.

---

## Handling these secrets

`vercel-env.txt` is gitignored and must stay that way. Before committing, it is
worth confirming nothing sensitive is staged:

```bash
git diff --cached | grep -iE "GOCSPX|npg_|S3_SECRET|AUTH_SECRET|PAYLOAD_SECRET"
```

Anything that has been pasted into a chat window, a ticket, or an email should
be treated as exposed and rotated. Rotation is cheap for all of these:

| Secret | How to rotate | Impact |
|---|---|---|
| `AUTH_GOOGLE_SECRET` | Google Cloud Console → Credentials → reset secret | None for readers |
| `S3_*` keys | R2 → Manage API Tokens → revoke and recreate | None once redeployed |
| `DATABASE_URI` | Neon → Roles → reset password | None once redeployed |
| `AUTH_SECRET` | Generate a new one | Signs all readers out |
| `PAYLOAD_SECRET` | Generate a new one | **Breaks existing admin sessions and encrypted fields — avoid** |
