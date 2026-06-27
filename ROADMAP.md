# Roadmap — Deferred Features

This document tracks features that are intentionally **not part of the current development phase**. The initial build focuses on the editorial / reading experience: browsing news, reading articles, navigation, and discovery. Account-driven, personalization, and search features will be added in a later phase once the core editorial product is validated.

> Status: **Phase 1 — Editorial frontend** (current)
> These features are scoped for **Phase 2 — Reader accounts & personalization** and beyond.

---

## Deferred features

### 1. Authentication (Sign in / Login / Forgot password)
- **Why deferred:** No accounts are needed to read content. Auth requires a backend, session management, password reset flow, OAuth providers, security review, and email infrastructure — all out of scope right now.
- **What we'll need later:**
  - Auth provider decision (NextAuth, Clerk, Supabase Auth, or custom)
  - Session storage strategy (JWT vs database sessions)
  - Email service for verification & password reset
  - Protected route middleware
  - Account settings page
- **Pages/components affected once added:** `/login`, `/signup`, `/forgot`, header "Sign in" button, user menu

### 2. Subscription / Paywall / Membership
- **Why deferred:** Monetization requires a payments integration (Razorpay/Stripe), tier definitions, business model decisions, and the editorial product needs to prove value first.
- **What we'll need later:**
  - Payment provider integration
  - Subscription tiers (free, monthly, annual, lifetime)
  - Paywall logic (which articles are gated, soft vs hard paywalls, metered reads)
  - Subscriber-only content tagging in the CMS
  - Billing portal & invoice history
- **Pages/components affected once added:** Header "Subscribe" CTA, `/subscribe`, paywall overlays on premium articles, member badges

### 3. Search
- **Why deferred:** Building search means picking an indexing engine (Algolia, Meilisearch, Typesense, Postgres FTS, or Elasticsearch), defining the index schema, and building autocomplete + filters. The site can launch with category-based discovery only.
- **What we'll need later:**
  - Search provider decision
  - Indexing pipeline (articles, authors, leaders, fact-checks)
  - Search UI: header search box, dedicated `/search` page, filters (date, category, author, verification level)
  - Autocomplete / typeahead
  - Analytics on search queries to inform editorial decisions
- **Pages/components affected once added:** Header `SearchBar` component, `/search` page, mobile menu search input

### 4. Bookmarks / Save for later
- **Why deferred:** Bookmarks require user accounts (depends on Auth) and persistence (depends on a backend). Until then, readers can use browser bookmarks.
- **What we'll need later:**
  - User-scoped bookmark storage (DB table linking user → article)
  - Bookmark API endpoints (add, remove, list)
  - `/bookmarks` page UI
  - Bookmark toggle state on `ArticleCard` and `ShareBar`
  - Optimistic UI for toggling
- **Pages/components affected once added:** `/bookmarks`, Bookmark icon in `Header`, Bookmark button in `ArticleCard`, "Save" button in `ShareBar`

### 5. Notifications
- **Why deferred:** Notifications require an auth system, preference storage, a delivery channel (web push, email, in-app), and editorial workflows for triggering them.
- **What we'll need later:**
  - Notification preferences (which topics, which channels)
  - Web Push (service worker) and/or email notification service
  - In-app inbox UI
  - Trigger pipeline (e.g., breaking news, fact-check published, leader update)
- **Pages/components affected once added:** Bell icon in `Header`, `/notifications` page

### 6. Newsletter signup (consider Phase 1.5)
- **Status:** A `/newsletter` page exists with a signup form, but no real submission integration yet. May ship as a no-account email capture (e.g., Mailchimp/ConvertKit/Beehiiv) before full auth lands.
- **What we'll need:**
  - Email provider integration
  - Signup confirmation flow (double opt-in)
  - List segmentation

### 7. Comments / Reader voice
- **Status:** A `CommentSection` component exists with mock data, but real commenting depends on auth and moderation. Treat as Phase 2.
- **What we'll need later:**
  - Auth (see #1)
  - Moderation tools, abuse reporting
  - Comment storage & threading model
  - Spam/abuse prevention

---

## Current Phase 1 scope (what IS being built)

- Editorial browse experience: home, category pages, article reading
- Fact-check pages and leader profiles (read-only)
- Live updates and breaking news ticker (read-only)
- Mobile-first responsive layout
- Theme support (light / dark)
- Static-friendly navigation that works without JavaScript-heavy account features

---

## When to revisit this document

Revisit and promote items to "in-progress" when:
- The editorial product has shipped and is stable
- There is a defined product/business decision to add monetization or accounts
- Real-user analytics (or feedback) shows demand for one of these capabilities
