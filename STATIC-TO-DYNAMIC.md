# Static → Dynamic: what still needs to move into the admin panel

Everything a **non-developer should be able to change** but currently can't,
because it is hardcoded in the code. Ordered by how often you'll want to edit it
and how much damage the hardcoding does.

Status key: ✅ already dynamic · 🔴 hardcoded, high priority · 🟠 hardcoded,
worth doing · ⚪ fine as code

---

## ✅ Already managed from `/admin` (no action needed)

Articles · Fact-checks · Videos (auto-synced from YouTube) · Authors ·
Categories · Tags · Leaders (bio, promises, timeline) · Parties · Polls ·
Comments (moderation) · Readers · Newsletter waitlist · **Reader submissions
(new)** · Media library · Site name, tagline and all social handles.

---

## 🔴 Priority 1 — change often, or currently wrong

### 1. Navigation menus — `lib/constants.ts:16-68`
`PRIMARY_NAV` (header) and `FOOTER_LINKS` (4 footer columns) are code arrays.
Adding a section, reordering the header, or removing a dead link needs a
developer and a deploy.
**Build:** a `Navigation` global — repeatable rows of `{ label, labelHi, href,
group }`. ~1 hour.

### 2. Category list — `lib/constants.ts:3-14`
This is the worst offender because it **contradicts the database**. Categories
are a real collection editors can add to, but `/category/[slug]` only accepts
these 10 hardcoded slugs, and the label/description shown come from the file,
not the CMS. Create "Business" in the admin, file ten stories under it, and
`/category/business` returns 404 while `/category/podcasts` still renders a page
for a section that no longer exists.
**Build:** read categories from the DB in `generateStaticParams` and the page;
delete the constant. Also fix the article breadcrumb to link `/category/<slug>`.
~2 hours. **Do this one first.**

### 3. States list — `lib/constants.ts:70-91`
20 hardcoded states drive the `/state-news` filter chips and the Leaders/Polls
dropdowns. India has 28 states and 8 union territories — the list is incomplete
and can't be corrected without a deploy.
**Build:** a `States` collection (name, nameHi, slug) referenced by Leaders,
Polls and the filters. ~2 hours.

### 4. Election data — `lib/election-data.ts` (entire file)
~1,700 lines of **invented** results: fictional parties (BJVP, JSM, BPF) and
fictional winners, driving `/elections` and every `/elections/[state]` page.
Now labelled "Sample data" so it isn't presented as reporting, but it should be
real and editable.
**Build:** `ElectionResults` and `ConstituencyResults` collections (state, seats,
per-party seats/vote-share, turnout, winner → link to a real Leader). ~4 hours.
Until then the pages carry an honest placeholder notice.

### 5. Newsletter definitions — `app/(site)/newsletter/page.tsx:8-35`
The four newsletters (name, cadence, description) are hardcoded; subscriber
counts were invented and are now neutralised.
**Build:** a `Newsletters` collection, or a repeatable field on Settings. ~1 hour.

---

## 🟠 Priority 2 — set once, but you'll want to change them yourself

### 6. Contact details — `app/(site)/contact/page.tsx:8-30`
Desk emails (`tips@`, `corrections@`, `partners@`), the phone number, and the
newsroom address are all in code. Note the office address and landline are
placeholders you should replace with real ones — and the Signal claim can't work
against a landline.
**Build:** a `Contact` global. ~30 min.

### 7. Editorial code & About page copy — `app/(site)/about/page.tsx`
Your editorial standards, corrections policy and fact-check methodology are
code. These are exactly the documents a newsroom revises. (The "by the numbers"
box is now computed from the database ✅.)
**Build:** either a `Pages` collection with rich text, or fields on a `About`
global. ~2 hours.

### 8. Legal pages — `privacy/page.tsx`, `terms/page.tsx`
Now corrected to match reality (no passwords, no payments), but still code.
Legal text changes when the product changes and shouldn't need a deploy.
**Build:** same `Pages` collection as above. ~1 hour once #7 exists.

### 9. Advertising rate card — `app/(site)/advertise/page.tsx:8-27`
Ad formats and prices in code. The invented audience figures and the
podcast product are removed; what remains should be yours to edit.
**Build:** an `AdFormats` collection or Settings group. ~1 hour.

### 10. Careers listings — `app/(site)/careers/page.tsx`
Six roles hardcoded; every "Apply" link now points at /contact (they were dead
`#` links). Roles change constantly.
**Build:** a `Jobs` collection (title, location, type, description, status).
~1 hour.

### 11. Homepage section headings and copy — `app/(site)/page.tsx`
"Power, policy and the politics of nation-building", "Track every promise. Rate
every leader.", the video-desk heading and the newsletter pitch are all in code.
**Build:** a `Homepage` global with a heading/description per section — and,
ideally, section on/off toggles and ordering. ~3 hours.

### 12. Section-page hero copy — every listing page
`/news`, `/politics`, `/opinion`, `/explainers`, `/international`,
`/state-news`, `/trending`, `/fact-check`, `/videos`, `/polls`, `/leader` each
hardcode their own kicker/title/description.
**Build:** fold into the Categories collection (each category already has a
`description` field that is currently ignored in favour of the constant). ~1 hour
after #2.

---

## ⚪ Correctly left in code

- Design tokens and the three themes (`globals.css`) — design system, not content
- Party colours as a fallback, verification badge labels, fact-check rating
  scale, promise statuses — these are **schema**; changing them changes meaning
- Route structure, component layout, SEO templates
- `scripts/seed-data.ts` — frozen demo content for seeding a fresh database

---

## Suggested order

1. **Categories** (#2) — it actively breaks: CMS categories 404 on the site
2. **Navigation** (#1) — you'll want to reorder the header the week you launch
3. **Contact + About/Legal pages** (#6, #7, #8) — your own words, your own edits
4. **States** (#3) — completes the filters
5. **Newsletters, Careers, Ad formats** (#5, #10, #9) — as each becomes real
6. **Homepage/section copy** (#11, #12) — the polish layer
7. **Election data** (#4) — the biggest job; do it before the next election

Roughly 2–3 days of work in total, and it can be done incrementally — each item
is independent, and every one of them removes a reason to call a developer.
