# TheQuiverIndia — Politics. Power. People.

An editorial-first political news platform for India. Inspired by The Quint's
storytelling and Molitics' leader transparency, built with a calm, newspaper-grade
reading experience.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run start        # serve the build
```

## Tech stack

- **Next.js 14** (App Router, RSC, SSG by default)
- **TypeScript** — strict mode
- **Tailwind CSS** — design tokens via CSS variables, dark mode via `class`
- **lucide-react** — icons
- **Fraunces** (serif) + **Inter** (sans) via `next/font`

No backend yet. All content lives in `lib/mock-data.ts` so the entire UI is
explorable end-to-end.

## What's inside

37 routes. Every one is designed — no blank pages, no 404 stubs.

```
Editorial      /  /article/[slug]  /news  /politics  /opinion  /explainers
               /trending  /international  /state-news  /category/[slug]
Elections      /elections  /elections/[state]
Leaders        /leader  /leader/[slug]
Trust          /fact-check  /fact-check/[slug]
Multimedia     /videos  /videos/[slug]  /podcasts  /podcasts/[slug]
Interactive    /polls  /polls/[slug]  /live  /search
User           /profile  /bookmarks  /notifications  /settings
Auth           /login  /signup  /forgot
Static         /about  /contact  /privacy  /terms  /careers  /advertise  /newsletter
System         /not-found  /error  /loading
```

## Why people would prefer this platform

Baked into the UI, not bolt-on:

1. **Verification badges inline** — every article shows verification level + source count
2. **Promise tracker per leader** — visual kept/in-progress/broken counts
3. **Constituency-level election data**, not just topline party totals
4. **Fact-check rating scale** — evidence trail and sources visible on every verdict
5. **Reading experience** — Fraunces serif, reading progress bar, est. read time, distraction-free body
6. **Editorial code page** at `/about#code` — transparent commitments visible to readers
7. **No popups, no clickbait, no autoplay** — clearly labelled ads only
8. **6-language switcher** in the header (UI is wired, only English content shipped)
9. **Dark mode** — proper class-strategy toggle with system-preference detection
10. **Mobile-first** — sticky header, slide-out mobile menu, swipeable category nav

## Folder shape

```
app/                  # Next.js App Router — every route
components/
  layout/             # Header, Footer, LiveTicker, MobileMenu, ThemeToggle
  cards/              # ArticleCard, PoliticianCard, VideoCard, PollCard, FactCheckCard, PodcastCard
  sections/           # CategoryHero, CategoryGrid, NewsletterCTA, TrendingTags, PageHero
  article/            # ArticleBody, ShareBar, AuthorByline, ReadingProgress, CommentSection
  politician/         # PromiseTracker, Timeline
  election/           # SeatChart, VoteShareBars
  auth/               # AuthShell
  user/               # UserNav
  ui/                 # Container, Button, Badge, Tag, Kicker, Avatar, Tabs, etc.
lib/
  types.ts            # All TS interfaces
  mock-data.ts        # Articles, leaders, polls, fact-checks, videos, podcasts, live updates
  constants.ts        # Navigation, categories, states, party colors
  utils.ts            # cn, formatDate, timeAgo, formatNumber, slugify, initials
```

## Theming

Three switchable theme families, each with light + dark variants — six looks total.
Pick the palette from the palette icon in the header; sun/moon toggles the mode
(light / dark / system, synced across tabs and with the OS).

```
editorial   indigo & marigold (default)
peacock     teal & gold — the signature look
press       ivory paper & oxblood — classic broadsheet
```

Implementation: `data-theme` attribute + `.dark` class on `<html>`, applied
pre-paint by `components/layout/ThemeScript.tsx` and managed by `lib/theme.ts`
(storage keys `tqi-theme` / `tqi-mode`, `color-scheme`, runtime
`<meta name="theme-color">`).

## Design tokens

CSS variables in `app/globals.css` — every theme defines the full set.

```
bg / bg-subtle / bg-muted    surfaces
ink / ink-muted / ink-subtle text scale
line / line-strong           borders
brand / brand-soft           identity
accent                       kickers, highlights (theme signature; `saffron` is a legacy alias)
breaking / verified          news semantics — stable across themes
success / warn / danger / info  status ramp (fact-checks, promises, live tags)
on-media                     text over photos/scrims — never theme-flips
```

Reach for `text-balance` / `text-pretty` on headlines and `prose-article` on
long-form bodies.

## What to wire up next (Phase 2)

- Real backend: NestJS + Postgres for articles, users, polls, comments
- Auth: NextAuth or Clerk
- Search: Meilisearch / Algolia / Elasticsearch
- CMS: headless (Sanity / Strapi) for editorial workflow
- Real-time live updates via Server-Sent Events or Pusher
- Analytics: Plausible / Umami (privacy-first)
- I18n: next-intl for the 6 language toggle in the header

The component shapes already match these eventual integrations — replace
`lib/mock-data.ts` with real fetchers and the UI keeps working.
