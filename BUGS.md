# TheQuiverIndia — End-to-End Bug Audit

Audited: 2026-08-09 · Live site: https://thequiverindia.com · Branch: `main`

**How this was produced:** four independent module-level code audits (data layer,
APIs/auth, pages, components/infra) plus direct probing of the live site and the
production Neon database.

**Legend**
- 🔴 **LIVE** — I reproduced it on the running production site or database.
- 🟠 **CODE** — confirmed by reading the code; will occur under the stated conditions.
- ⚪ **LATENT** — real defect, not currently reachable in production.

Production content at audit time: 13 published articles (all Hindi), 1 fact-check,
2 leaders, 1 poll, 25 videos, 50 media, 1 admin, 1 reader, 0 comments, 0 votes.

---

## P0 — Fix first

### 1. 🔴 `NEXT_PUBLIC_SITE_URL` in Vercel is still the placeholder
**Module:** infra/env · **Impact:** all SEO + social sharing

Vercel has `NEXT_PUBLIC_SITE_URL=https://REPLACE-WITH-YOUR-DOMAIN`. Verified live:

```
sitemap.xml       <loc>https://REPLACE-WITH-YOUR-DOMAIN/politics</loc>
news-sitemap.xml  <loc>https://REPLACE-WITH-YOUR-DOMAIN/article/…</loc>
feed.xml          <link>https://REPLACE-WITH-YOUR-DOMAIN</link>
robots.txt        Sitemap: https://REPLACE-WITH-YOUR-DOMAIN/sitemap.xml
og:image          https://replace-with-your-domain/opengraph-image?…
```

Google cannot use the sitemaps, RSS is broken for every subscriber, and every
shared link (WhatsApp/Instagram/X) has a broken preview image.

**Fix:** set `NEXT_PUBLIC_SITE_URL=https://thequiverindia.com` in Vercel → redeploy.

### 2. 🟠 Any staff account can promote itself to admin
**Module:** `collections/Users.ts:15-18` · **Impact:** full CMS takeover

```ts
access: { admin: () => true },   // read/create/update/delete are NOT defined
```
Payload's defaults then apply (`defaultAccess = Boolean(user)`), so **any**
logged-in staff user — including the lowest-privilege `author` — can call the
public REST API:
- `POST /api/users {role:"admin"}` → instant full admin
- `PATCH /api/users/<admin-id> {password:"…"}` → take over the owner account
- `DELETE /api/users/<admin-id>` → remove the real admins

Not exploitable by the public (unauthenticated writes correctly return 403 —
verified live), but it means every future editor/author you add is effectively an
admin. **Fix before adding your first team member.**

### 3. 🔴 The homepage shows the same handful of stories over and over
**Module:** `app/(site)/page.tsx` · **Impact:** looks broken/thin to every visitor

Verified live: the homepage contains **41 article links pointing at only 10
unique articles**; one article appears **7 times**. `/trending` is worse — **9 of
9** articles are duplicated on the page.

Causes, all in `page.tsx`:
- `hero` (`docs[0]`) + `sub` (`docs[1..3]`) are re-printed in the "Latest" rail (`:67`)
- `picks` falls back to `mostRead` (`:44`) which is already in the rail (`:68`)
- `/trending`: hero = `sortedByViews[0]`, and the sidebar re-prints the same list

### 4. 🔴 "Most read" is frozen on 3 articles and can never change
**Module:** `collections/Articles.ts:169`, `lib/data/index.ts:294`

`views` is **never incremented anywhere** — no route, no hook, no counter. Only
the seed script ever wrote it. Verified in production: 3 articles carry inherited
seed view counts (84210 / 38450 / 24300); the other **10 are stuck at 0 forever**.

Consequences: "Most read" (homepage rail, article sidebar, `/trending`) can only
ever show those 3; every real article displays "0 views"; and `/trending` claims
"ranked by how many people read… in the last 24 hours", which is untrue.

**Fix:** add a view-count endpoint (batched) or remove the counts and the
"trending" framing until it's real.

### 5. 🔴 Missing pages return HTTP 200 instead of 404
**Module:** all dynamic routes · **Impact:** Google indexes junk URLs

Verified live — every one of these returns **200**:
`/article/does-not-exist-xyz`, `/leader/nope`, `/polls/nope`, `/videos/nope`,
`/fact-check/nope`, `/category/nope`, `/elections/nope`.

The pages call `notFound()` correctly, but the response status is 200 (soft 404).
Search engines will index unlimited nonexistent URLs.

---

## P1 — High

### 6. 🔴 The Ledger — your signature feature — is invisible
**Module:** `components/sections/AccountabilityLedger.tsx:13`

Both leaders in production have **0 promises**, so `promisesTracked === 0` and the
component returns `null`. The homepage's flagship accountability strip silently
does not exist. Either add promises to leaders, or render a "coming soon" state
instead of vanishing.

### 7. 🔴 8 fake placeholder videos are live
**Module:** data · 25 videos, **8 have `youtubeId: "seed-placeholder-N"`**

Their detail pages show "Video arriving soon on our YouTube channel" and they
cannot play. Delete them in `/admin → Videos`.

### 8. 🟠 Empty image `src` on any post without a hero image
**Module:** `lib/data/index.ts:43` + all cards

`heroImage`, fact-check `image`, leader `photo` and video `thumbnailUrl` are all
**optional** in the CMS, and `mediaUrl()` returns `''`. Next 15 does not throw on
`src=""` (verified in its source) — it emits `<img src="">`, which browsers
resolve to **the current page URL**, firing a duplicate full-page request per
image and painting a broken icon. A 12-card grid = 12 wasted page-sized requests.

Affected: `ArticleCard` (all 6 variants), `VideoCard` ×3, `FactCheckCard`,
`article/[slug]/page.tsx:159`. (`Avatar` and `videos/[slug]` already guard —
copy that pattern.)

### 9. 🟠 Editors' renames never reach the site (stale for up to a year)
**Module:** `collections/{Categories,Tags,Authors,Media}.ts` + `lib/data`

Category/tag/author labels are **denormalized into the `articles` cache**, but:
- `Tags.ts` has **no revalidation hooks at all**
- `Categories.ts` fires `revalidateTag('categories')` — **no cached function uses that tag**
- `Authors.ts` fires `authors` — bylines live in the `articles` cache
- `Media.ts` has no hooks — replacing an image never busts articles

`unstable_cache` defaults to a **one-year TTL**. Renaming a tag, fixing a category
typo, changing an author photo, or replacing an image will not appear on the site
until an unrelated article is edited or you redeploy.

### 10. 🟠 Site Settings changes never take effect
**Module:** `globals/Settings.ts` (no hooks) + `lib/data/index.ts:561`

`revalidateTag('settings')` is called nowhere. Changing your Instagram/YouTube
handles or channel ID in `/admin` keeps rendering the old values in the footer for
up to a year.

### 11. 🟠 Autosave wipes the entire article cache every 3 seconds
**Module:** `collections/Articles.ts:47-52` + `hooks/revalidate.ts:16`

Draft autosave fires `afterChange` → `revalidateTag('articles')` unconditionally
(no `_status` check). While anyone edits an article, the homepage, all section
pages, `/search`, `/trending`, every article page, RSS and the news sitemap are
continuously invalidated — the site serves uncached and hammers Neon.

**Fix:** skip revalidation when `doc._status !== 'published'` and the previous
status was also not published.

### 12. 🟠 Unpublished drafts leak onto the public site
**Module:** `lib/data/index.ts` (relationship population)

Top-level queries filter `_status: published`, but populated relationships
(`related`, `translationOf`, `factCheck`) do **not**. Hand-picking an embargoed
draft as "related" publishes its headline and kicker in the sidebar, linking to a
404.

### 13. 🟠 `generateStaticParams` prerenders drafts as baked 404s
**Module:** `lib/data/index.ts:571` — `listSlugs()` has no `_status` filter
(unlike `sitemap.ts`, which does). Every unpublished draft becomes a static 404 at
build. Also capped at `limit: 200`.

### 14. 🟠 Poll votes can be lost and can 500
**Module:** `app/(site)/api/polls/vote/route.ts:23-56`

Read-modify-write with no atomicity: two concurrent voters both read `100` and
both write `101` — one vote vanishes, and `totalVotes` drifts from the sum of
options (the UI computes percentages from both). Payload also deletes and
re-inserts the entire options array per vote, so concurrent votes can deadlock or
throw a duplicate-key error → uncaught **500**. The duplicate-vote check is racy;
the DB unique index catches it (verified present in production) but surfaces as a
500 rather than the intended 409.

### 15. 🟠 Rate limiting is effectively absent
**Module:** `lib/rate-limit.ts`
- The key uses `X-Forwarded-For[0]`, which is **client-supplied** → a spammer
  rotates the header and gets a fresh bucket every request.
- The `Map` is per-lambda on Vercel → the limit is `max × instances` and resets on
  every cold start.
- `/api/bookmarks` has **no rate limit at all**.
- The comment form renders **no honeypot field**, though the API checks for one.

### 16. 🟠 A stale/failed reader session breaks the account permanently
**Module:** `auth.ts:19-61`
- `readerId` is resolved once and cached in a 30-day JWT, never re-validated. If
  that Readers row is deleted (or the DB is reseeded), every comment/bookmark/vote
  hits a foreign-key error → uncaught **500**, forever, with no self-heal.
- A sign-in race (two tabs) hits the unique-email constraint; the error is
  swallowed by an empty `catch`, minting a token **without** `readerId`. The user
  looks signed in but gets "Sign in to comment" on every action and a zeroed
  profile.

### 17. 🟠 `/api/bookmarks` POST trusts unvalidated input
**Module:** `app/(site)/api/bookmarks/route.ts:21-44` — no existence check on
`articleId` (unlike the comments route), so a bad or huge id → uncaught 500;
double-click races the unique index → 500.

### 18. 🟠 Three real forms silently discard user input
**Module:** `components/ui/MockForm.tsx` (`preventDefault()` and nothing else)
- `/contact` — "Send us a message"
- `/fact-check#submit` — **"Submit a claim for verification"**, promoted from the homepage
- `/advertise` — "Request media kit"

Users fill them in, click submit, and the data is gone with no feedback.
(`WaitlistForm` posts correctly — copy that.)

### 19. 🟠 JSON-LD article image is a relative, robots-blocked URL
**Module:** `app/(site)/article/[slug]/page.tsx:74` — `image: [article.image]`
emits `/api/media/file/…`. schema.org requires absolute URLs, **and** `robots.ts`
disallows `/api/`. This silently disqualifies every article from Google News /
Top Stories rich results.

### 20. 🔴 No canonical tags anywhere
Verified live: zero `rel="canonical"` on article pages or the homepage. With
`/politics` and `/category/politics` serving identical content (see #29), this is
a live duplicate-content problem.

### 21. 🔴 The site declares English while serving 100% Hindi
**Module:** `app/(site)/layout.tsx` hardcodes `<html lang="en">`. All 13 published
articles are `hi`. Article pages set `lang="hi"` on the `h1`/body (good), but
listings, cards and the RSS channel (`<language>en-IN</language>`) all claim
English.

### 22. 🔴 `www.thequiverindia.com` does not resolve
DNS is correct; the domain just isn't attached in Vercel. Add it as a redirect to
the apex.

---

## P2 — Medium

23. 🟠 **Pagination is dead code.** `getArticles` accepts `page` and returns
    `totalPages`, but **no caller passes it**; listings fetch `limit: 100` and
    paginate in memory. Article #101 becomes permanently unreachable.
24. 🟠 **`?page=abc` / `?page=999` renders a blank grid** with "Page NaN of 11"
    and no empty state (`CategoryGrid.tsx:30`).
25. 🔴 **Timestamps freeze.** `timeAgo()` is computed at render, and pages are
    cached until an editor publishes — a story can read "5m ago" for days.
26. 🟠 **Search never matches tags.** Every tag chip links to `/search?q=<tag>`,
    but `searchArticles` only queries `title` and `excerpt`. Multi-word queries
    also require all words in the *same* field, and `%`/`_` aren't escaped.
27. 🟠 **Hindi labels are collected but never shown.** `Category.labelHi` /
    `Tag.labelHi` exist in the CMS and are dropped by the mapper.
28. 🟠 **Breadcrumbs 404 for any new category.** `article/[slug]/page.tsx:98`
    builds `/${category}`, but only 8 top-level routes exist. A CMS-created
    category ("Business") yields a dead breadcrumb; the target should be
    `/category/<slug>`.
29. 🟠 **`/category/*` duplicates `/politics` etc.** byte-for-byte, is linked from
    nowhere, has no canonical, and `/category/podcasts` renders a page for a
    deleted section.
30. 🟠 **`/search` is fully crawlable** and linked from every article tag — a
    crawl-budget sink of thin duplicate pages. Needs `noindex` + robots disallow.
31. 🟠 **Bookmarks show unpublished/retracted articles** (`lib/data/reader.ts:32`
    has no status filter) — a legal-risk case for a newsroom.
32. 🟠 **Signed-in readers can't vote from the homepage** —
    `page.tsx:207` omits `signedIn`/`votedOptionId`, so `PollCard` always shows
    "Sign in to cast your vote".
33. 🟠 **Every vote/sync invalidates *all* polls/videos** (broad tags).
34. 🟠 **`formatDate('')` prints "Invalid Date"** on leader promises with no date.
35. 🟠 **Wrong host credited on videos** — `videos/[slug]:29` falls back to
    `authors[0]` when `v.host` doesn't match, misattributing a real byline.
36. 🟠 **Postgres sorts NULLs first on DESC** — a video saved without a date jumps
    to the top of `/videos` in production (but not locally).
37. 🟠 **YouTube sync is all-or-nothing** — one malformed entry aborts the run;
    slug collisions get a single retry then throw.
38. 🟠 **Language leaks across listings** — `getArticles` is called without a
    `language` filter on the homepage and every section page.
39. 🟠 **Filter/search forms drop active filters** on submit (`/fact-check`,
    `/leader` — no hidden inputs), and invalid filter values leave "All"
    highlighted over a zero-result list.
40. 🟠 **"Active polls" counts closed polls**; "Today's poll" is just the poll with
    the furthest-future end date.
41. 🟠 **State filter doesn't filter the hero** on `/state-news`, and the empty
    state can render "No stories from  yet."
42. 🟠 **`/api/comments` GET 500s on `?article=abc`** (NaN into an integer column)
    — and nothing in the app calls that endpoint.
43. 🟠 **Waitlist accepts unbounded emails** (no length cap) and races to a 500 on
    duplicate submits.
44. 🟠 **Client callers parse the body before checking `res.ok`** — a 500 shows the
    reader `Unexpected token '<'`; `BookmarkButton` has no `catch` at all.

---

## P3 — Content honesty & polish

45. 🔴 **Fabricated data presented as real** (a credibility risk for a newsroom):
    - `/settings` — hardcoded "Reader / reader@example.com / Password last changed
      3 months ago" for **every** visitor, on a passwordless Google-only site
    - `/notifications` — fake notifications generated from recent articles, shown
      to signed-out visitors, tabs inert
    - `/about` — "42 staff journalists · 11 bureaus · 4,800+ stories · 612
      fact-checks", contradicted by the real counts on the same page
    - `/advertise` — sells **"Podcast pre-roll ₹95K/episode, 2.4L weekly
      downloads"** for a section that was deleted
    - `/newsletter` — hardcoded subscriber counts
    - `/elections` — invented parties/winners under a "2024 Results" badge;
      turnout figures hardcoded **identically for every state**; "Highest margin"
      shows an unsorted first row
    - `/videos/[slug]` — hardcoded "2.4K" likes / "312" comments
46. 🟠 **Language switcher does nothing** — 6 languages offered, `setActive` only,
    state resets on navigation.
47. 🟠 **Career listings all link to `href="#"`**.
48. 🟠 **Legal pages describe a different product** — Terms references passwords;
    Privacy references payments and reading history, none of which exist.
49. 🟠 **`/elections/[state]` winner links 404** (fictional names not in `leaders`).
50. 🟠 **Accessibility:** `BackToTop` stays tab-focusable while invisible;
    `MobileMenu` declares `aria-modal` without a focus trap (and can close itself
    if reopened within 180 ms).
51. ⚪ **`/api/sync-youtube` fails open** if `CRON_SECRET` is ever unset — verified
    **protected** in production today (401), but the guard should be inverted.
52. 🟠 **Error bodies leak internals** — `sync-youtube` returns raw `e.message`.
53. 🟠 **Sitemap omits** `/newsletter`, `/advertise`, `/careers`, `/privacy`,
    `/terms`; **news sitemap emits an empty `<urlset>`** on quiet days (Search
    Console flags it).
54. 🟠 **RSS spec violations** — `<author>` needs an email (use `dc:creator`), no
    `atom:link rel="self"`, control characters unescaped.
55. 🟠 **PWA manifest** — no maskable icon, white splash in dark mode,
    `theme_color` disagrees with the runtime value.
56. 🟠 **`HeaderUser` fires `/api/auth/session` on every pageview** for every
    anonymous visitor — the highest-volume function call in the app, purely to
    pick a link style (also causes a layout shift).
57. ⚪ **Dead code:** `components/layout/SearchBar.tsx` is never imported;
    per-slug cache tags (`articles:<slug>`) are emitted but no cached function
    consumes them; `WaitlistForm`'s honeypot value is never transmitted;
    two incompatible `slugify` implementations coexist.
58. 🔴 **Hindi articles carry English slugs** inherited from edited seed articles
    (e.g. a Hindi headline at `/article/parliament-monsoon-session-key-bills-2026`).

---

## Verified CLEAN — do not re-audit

- **Cache-key collisions** — refuted. `unstable_cache` includes `JSON.stringify(args)`
  in the key (verified in Next 15.4.11 source **and** live: different slugs return
  different articles). No page can serve another page's data.
- **Search itself works** — `like` maps to Postgres `ILIKE` (case-insensitive);
  verified live returning correct results for real terms.
- **Unique indexes exist in production** — verified directly against Neon:
  `reader_poll_idx` (UNIQUE) and `reader_article_idx` (UNIQUE) are present, so
  double-voting and duplicate bookmarks are blocked at the DB level.
- **Cron endpoint is protected** in production — returns 401 without the bearer token.
- **No IDOR** — no route accepts a reader id from the request body; all are scoped
  to the session.
- **Reader PII is not exposed** via the public REST API (`/api/readers` → 403,
  `/api/users` → 403, unauthenticated writes → 403).
- **Comment moderation is correctly wired** — anonymous reads are restricted to
  `approved`, submissions are forced to `pending`, and the `comments` cache tag is
  the one tag that is fully wired end to end.
- **Theme system is sound** — `lib/theme.ts` and `ThemeScript.tsx` are in sync;
  all six theme blocks define the full token set; CSS specificity is correct.
- **`/signup`, `/forgot`, `/profile` do redirect** in a real browser (RSC redirect
  payload present) even though curl sees a 200 shell.
- **Draft saves don't clobber published rows**; `publishedAt` stamping and
  author-edit isolation are correct.
- **`vercel.json` cron path resolves** and is within Hobby limits; `remotePatterns`
  covers every host actually used.
- **OG images** handle missing articles, long titles, and Devanagari.
