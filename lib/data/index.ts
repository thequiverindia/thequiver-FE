/**
 * Data-access layer — the ONLY place the frontend talks to the database.
 *
 * Every query is wrapped in unstable_cache with the same tags the Payload
 * hooks invalidate (`<collection>` and `<collection>:<slug>`), so an editor
 * hitting Publish regenerates exactly the affected pages within seconds.
 *
 * All functions return frontend view models (lib/types.ts), never raw
 * Payload docs — pages and components stay decoupled from CMS internals.
 */
import { unstable_cache } from 'next/cache';
import { getPayload, type Where } from 'payload';
import config from '@payload-config';
import { isPrerenderableSlug, SLUG_MAX_BYTES } from '@/collections/fields/slugField';

import type {
  Article as PArticle,
  Author as PAuthor,
  FactCheck as PFactCheck,
  Leader as PLeader,
  Media as PMedia,
  Party as PParty,
  Poll as PPoll,
  Video as PVideo,
} from '@/payload-types';
import type {
  Article,
  Author,
  FactCheck,
  Party,
  Politician,
  Poll,
  Video,
} from '@/lib/types';

const db = () => getPayload({ config });

const PUBLISHED = { _status: { equals: 'published' } } as const;

/* ------------------------------------------------------------------ */
/* mappers                                                             */
/* ------------------------------------------------------------------ */

function mediaUrl(m: PMedia | number | null | undefined, fallback = ''): string {
  if (!m || typeof m === 'number') return fallback;
  // Sharp only generates a size variant when the source is wider than the
  // target, so small uploads legitimately have no hero/card — fall through.
  return m.sizes?.hero?.url ?? m.sizes?.card?.url ?? m.url ?? fallback;
}

function mapAuthor(a: PAuthor | number | null | undefined): Author {
  if (!a || typeof a === 'number') {
    return { id: '0', name: 'TheQuiverIndia', handle: '', role: '', bio: '', avatar: '' };
  }
  return {
    id: String(a.id),
    name: a.name,
    slug: a.slug ?? undefined,
    handle: a.handle ?? '',
    role: a.role ?? '',
    bio: a.bio ?? '',
    avatar: mediaUrl(a.avatar as PMedia | number | null),
  };
}

export function mapArticle(doc: PArticle, withBody = false): Article {
  const category = typeof doc.category === 'object' && doc.category ? doc.category : null;
  const related =
    withBody && Array.isArray(doc.related)
      ? (doc.related.filter(
          (r) => typeof r === 'object' && r !== null && r._status === 'published',
        ) as PArticle[]).map((r) => mapArticle(r))
      : undefined;
  return {
    id: String(doc.id),
    slug: doc.slug ?? '',
    title: doc.title,
    kicker: doc.kicker ?? undefined,
    excerpt: doc.excerpt,
    category: category?.slug ?? '',
    categoryLabel: category?.label,
    tags: Array.isArray(doc.tags)
      ? doc.tags.filter((t) => typeof t === 'object').map((t) => (t as { label: string }).label)
      : [],
    image: mediaUrl(doc.heroImage as PMedia | number | null),
    imageCaption: doc.imageCaption ?? undefined,
    author: mapAuthor(doc.author as PAuthor | number),
    publishedAt: doc.publishedAt ?? doc.createdAt,
    updatedAt: doc.updatedAt,
    readMinutes: doc.readMinutes ?? 3,
    verification: (doc.verification ?? 'sourced') as Article['verification'],
    sourceCount: doc.sourceCount ?? 1,
    factCheckSlug:
      typeof doc.factCheck === 'object' &&
      doc.factCheck &&
      doc.factCheck._status === 'published'
        ? doc.factCheck.slug ?? undefined
        : undefined,
    isExclusive: doc.isExclusive ?? false,
    views: doc.views ?? 0,
    language: (doc.language ?? 'en') as Article['language'],
    body: withBody ? doc.body : undefined,
    related,
    translationOf:
      typeof doc.translationOf === 'object' &&
      doc.translationOf?.slug &&
      doc.translationOf._status === 'published'
        ? {
            slug: doc.translationOf.slug,
            language: (doc.translationOf.language ?? 'en') as Article['language'],
          }
        : null,
  };
}

function mapFactCheck(doc: PFactCheck): FactCheck {
  return {
    id: String(doc.id),
    slug: doc.slug ?? '',
    claim: doc.claim,
    claimant: doc.claimant,
    rating: doc.rating as FactCheck['rating'],
    verdict: doc.verdict,
    evidence: (doc.evidence ?? []).map((e) => e.point),
    sources: (doc.sources ?? []).map((s) => ({ label: s.label, url: s.url })),
    author: mapAuthor(doc.author as PAuthor | number),
    publishedAt: doc.publishedAt ?? doc.createdAt,
    image: mediaUrl(doc.image as PMedia | number | null),
    views: doc.views ?? 0,
    language: (doc.language ?? 'en') as FactCheck['language'],
  };
}

function mapLeader(doc: PLeader): Politician {
  const party = typeof doc.party === 'object' && doc.party ? doc.party : null;
  return {
    id: String(doc.id),
    slug: doc.slug ?? '',
    name: doc.name,
    party: party?.name ?? '',
    partyShort: party?.short ?? '',
    partyColor: party?.color ?? '#737373',
    constituency: doc.constituency ?? '',
    state: doc.state ?? '',
    position: doc.position ?? '',
    age: doc.age ?? 0,
    bio: doc.bio ?? '',
    image: mediaUrl(doc.photo as PMedia | number | null),
    rating: doc.rating ?? 0,
    followers: doc.followers ?? 0,
    promises: (doc.promises ?? []).map((p) => ({
      id: p.id ?? '',
      text: p.text,
      status: p.status as Politician['promises'][number]['status'],
      madeOn: p.madeOn ?? '',
      context: p.context ?? undefined,
      sourceUrl: p.sourceUrl ?? undefined,
    })),
    timeline: (doc.timeline ?? []).map((t) => ({
      date: t.date,
      kind: t.kind as Politician['timeline'][number]['kind'],
      title: t.title,
      description: t.description ?? '',
    })),
    socials: {
      twitter: doc.socials?.twitter ?? undefined,
      instagram: doc.socials?.instagram ?? undefined,
      facebook: doc.socials?.facebook ?? undefined,
      web: doc.socials?.web ?? undefined,
    },
    net_worth: doc.netWorth ?? undefined,
    education: doc.education ?? undefined,
    criminalCases: doc.criminalCases ?? undefined,
    attendance: doc.attendance ?? undefined,
    questionsAsked: doc.questionsAsked ?? undefined,
  };
}

function mapParty(doc: PParty): Party {
  return {
    id: String(doc.id),
    slug: doc.slug ?? '',
    name: doc.name,
    short: doc.short,
    color: doc.color ?? '#737373',
    founded: doc.founded ?? 0,
    ideology: doc.ideology ?? [],
    leader: doc.leader ?? '',
    seats: doc.seats ?? 0,
  };
}

function mapPoll(doc: PPoll): Poll {
  return {
    id: String(doc.id),
    slug: doc.slug ?? '',
    question: doc.question,
    description: doc.description ?? undefined,
    options: (doc.options ?? []).map((o) => ({
      id: o.id ?? '',
      label: o.label,
      votes: o.votes ?? 0,
      color: o.color ?? undefined,
    })),
    totalVotes: doc.totalVotes ?? 0,
    endsAt: doc.endsAt,
    category: doc.category,
    state: doc.state ?? undefined,
  };
}

function mapVideo(doc: PVideo): Video {
  const realYt = doc.youtubeId && !doc.youtubeId.startsWith('seed-');
  return {
    id: String(doc.id),
    slug: doc.slug ?? '',
    title: doc.title,
    description: doc.description ?? '',
    youtubeId: realYt ? doc.youtubeId : '',
    thumbnail:
      doc.thumbnailUrl ??
      (realYt ? `https://i.ytimg.com/vi/${doc.youtubeId}/hqdefault.jpg` : ''),
    duration: doc.duration ?? '',
    views: doc.views ?? 0,
    publishedAt: doc.publishedAt ?? doc.createdAt,
    series: doc.series ?? undefined,
    host: doc.host ?? '',
  };
}

/* ------------------------------------------------------------------ */
/* articles                                                            */
/* ------------------------------------------------------------------ */

export const getArticles = unstable_cache(
  async (opts: {
    limit?: number;
    page?: number;
    category?: string;
    language?: string;
    sort?: string;
    excludeSlug?: string;
  } = {}) => {
    const { limit = 12, page = 1, category, language, sort = '-publishedAt', excludeSlug } = opts;
    const payload = await db();
    const where: Where[] = [PUBLISHED];
    if (category) where.push({ 'category.slug': { equals: category } });
    if (language) where.push({ language: { equals: language } });
    if (excludeSlug) where.push({ slug: { not_equals: excludeSlug } });
    const res = await payload.find({
      collection: 'articles',
      where: { and: where },
      sort,
      limit,
      page,
      depth: 2,
    });
    return {
      docs: res.docs.map((d) => mapArticle(d)),
      totalPages: res.totalPages,
      totalDocs: res.totalDocs,
    };
  },
  ['articles-list'],
  { tags: ['articles'] },
);

export const getArticleBySlug = unstable_cache(
  async (slug: string) => {
    const payload = await db();
    const res = await payload.find({
      collection: 'articles',
      where: { and: [PUBLISHED, { slug: { equals: slug } }] },
      limit: 1,
      depth: 2,
    });
    const doc = res.docs[0];
    if (!doc) return null;
    const article = mapArticle(doc, true);
    // The translation link is one-directional in the CMS; resolve the
    // reverse direction too so both language versions cross-link.
    if (!article.translationOf) {
      const reverse = await payload.find({
        collection: 'articles',
        where: { and: [PUBLISHED, { translationOf: { equals: doc.id } }] },
        limit: 1,
        depth: 0,
      });
      const r = reverse.docs[0];
      if (r?.slug) {
        article.translationOf = {
          slug: r.slug,
          language: (r.language ?? 'en') as Article['language'],
        };
      }
    }
    return article;
  },
  ['article-by-slug'],
  { tags: ['articles'] },
);

export const getMostReadArticles = unstable_cache(
  async (limit = 5) => {
    const payload = await db();
    const res = await payload.find({
      collection: 'articles',
      where: PUBLISHED,
      sort: '-views',
      limit,
      depth: 2,
    });
    return res.docs.map((d) => mapArticle(d));
  },
  ['articles-most-read'],
  { tags: ['articles'] },
);

/**
 * Related content engine (Layer 0 + 1 of the plan):
 *   1. editor-picked `related` first,
 *   2. then scored automatic matching (shared tags ×3, same category ×2,
 *      same author ×1, newer wins ties), same language only,
 *   3. topped up with latest-in-category so the box is never empty.
 */
export async function getRelatedArticles(article: Article, limit = 3): Promise<Article[]> {
  const picked = (article.related ?? []).slice(0, limit);
  if (picked.length >= limit) return picked;

  const { docs: candidates } = await getArticles({
    limit: 24,
    language: article.language,
    excludeSlug: article.slug,
  });
  const pickedIds = new Set(picked.map((p) => p.id));
  const tagSet = new Set(article.tags);
  const scored = candidates
    .filter((c) => !pickedIds.has(c.id))
    .map((c) => {
      let score = 0;
      for (const t of c.tags) if (tagSet.has(t)) score += 3;
      if (c.category === article.category) score += 2;
      if (c.author.id === article.author.id) score += 1;
      return { c, score };
    })
    .sort((a, b) => b.score - a.score || +new Date(b.c.publishedAt) - +new Date(a.c.publishedAt));

  return [...picked, ...scored.map((s) => s.c)].slice(0, limit);
}

export const searchArticles = unstable_cache(
  async (q: string, limit = 30) => {
    const payload = await db();
    const res = await payload.find({
      collection: 'articles',
      where: {
        and: [
          PUBLISHED,
          { or: [{ title: { like: q } }, { excerpt: { like: q } }] },
        ],
      },
      sort: '-publishedAt',
      limit,
      depth: 2,
    });
    return res.docs.map((d) => mapArticle(d));
  },
  ['articles-search'],
  { tags: ['articles'] },
);

export const getTrendingTags = unstable_cache(
  async (limit = 10) => {
    const { docs } = await getArticles({ limit: 30 });
    const counts = new Map<string, number>();
    for (const a of docs) for (const t of a.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([tag]) => tag);
  },
  ['trending-tags'],
  { tags: ['articles'] },
);

/* ------------------------------------------------------------------ */
/* fact-checks                                                         */
/* ------------------------------------------------------------------ */

export const getFactChecks = unstable_cache(
  async (opts: { rating?: string; q?: string; limit?: number } = {}) => {
    const { rating, q, limit = 30 } = opts;
    const payload = await db();
    const where: Where[] = [PUBLISHED];
    if (rating) where.push({ rating: { equals: rating } });
    if (q) where.push({ or: [{ claim: { like: q } }, { claimant: { like: q } }] });
    const res = await payload.find({
      collection: 'fact-checks',
      where: { and: where },
      sort: '-publishedAt',
      limit,
      depth: 2,
    });
    return res.docs.map(mapFactCheck);
  },
  ['fact-checks-list'],
  { tags: ['fact-checks'] },
);

export const getFactCheckBySlug = unstable_cache(
  async (slug: string) => {
    const payload = await db();
    const res = await payload.find({
      collection: 'fact-checks',
      where: { and: [PUBLISHED, { slug: { equals: slug } }] },
      limit: 1,
      depth: 2,
    });
    return res.docs[0] ? mapFactCheck(res.docs[0]) : null;
  },
  ['fact-check-by-slug'],
  { tags: ['fact-checks'] },
);

/* ------------------------------------------------------------------ */
/* leaders & parties                                                   */
/* ------------------------------------------------------------------ */

export const getLeaders = unstable_cache(
  async (opts: { q?: string; party?: string; state?: string; sortByRating?: boolean } = {}) => {
    const payload = await db();
    const where: Where[] = [];
    if (opts.party) where.push({ 'party.short': { equals: opts.party } });
    if (opts.state) where.push({ state: { equals: opts.state } });
    if (opts.q)
      where.push({
        or: [{ name: { like: opts.q } }, { constituency: { like: opts.q } }],
      });
    const res = await payload.find({
      collection: 'leaders',
      where: where.length ? { and: where } : undefined,
      sort: opts.sortByRating ? '-rating' : 'name',
      limit: 100,
      depth: 1,
    });
    return res.docs.map(mapLeader);
  },
  ['leaders-list'],
  { tags: ['leaders'] },
);

export const getLeaderBySlug = unstable_cache(
  async (slug: string) => {
    const payload = await db();
    const res = await payload.find({
      collection: 'leaders',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
    });
    return res.docs[0] ? mapLeader(res.docs[0]) : null;
  },
  ['leader-by-slug'],
  { tags: ['leaders'] },
);

export const getParties = unstable_cache(
  async () => {
    const payload = await db();
    const res = await payload.find({ collection: 'parties', sort: '-seats', limit: 50 });
    return res.docs.map(mapParty);
  },
  ['parties-list'],
  { tags: ['parties'] },
);

export const getAuthors = unstable_cache(
  async () => {
    const payload = await db();
    const res = await payload.find({ collection: 'authors', sort: 'name', limit: 50, depth: 1 });
    return res.docs.map((a) => mapAuthor(a));
  },
  ['authors-list'],
  { tags: ['authors'] },
);

/* ------------------------------------------------------------------ */
/* polls & videos                                                      */
/* ------------------------------------------------------------------ */

export const getPolls = unstable_cache(
  async (opts: { category?: string } = {}) => {
    const payload = await db();
    const res = await payload.find({
      collection: 'polls',
      where: opts.category ? { category: { equals: opts.category } } : undefined,
      sort: '-endsAt',
      limit: 30,
    });
    return res.docs.map(mapPoll);
  },
  ['polls-list'],
  { tags: ['polls'] },
);

export const getPollBySlug = unstable_cache(
  async (slug: string) => {
    const payload = await db();
    const res = await payload.find({
      collection: 'polls',
      where: { slug: { equals: slug } },
      limit: 1,
    });
    return res.docs[0] ? mapPoll(res.docs[0]) : null;
  },
  ['poll-by-slug'],
  { tags: ['polls'] },
);

export const getVideos = unstable_cache(
  async (opts: { series?: string; limit?: number } = {}) => {
    const payload = await db();
    const res = await payload.find({
      collection: 'videos',
      where: opts.series ? { series: { equals: opts.series } } : undefined,
      sort: '-publishedAt',
      limit: opts.limit ?? 30,
    });
    return res.docs.map(mapVideo);
  },
  ['videos-list'],
  { tags: ['videos'] },
);

export const getVideoBySlug = unstable_cache(
  async (slug: string) => {
    const payload = await db();
    const res = await payload.find({
      collection: 'videos',
      where: { slug: { equals: slug } },
      limit: 1,
    });
    return res.docs[0] ? mapVideo(res.docs[0]) : null;
  },
  ['video-by-slug'],
  { tags: ['videos'] },
);

/* ------------------------------------------------------------------ */
/* aggregate widgets                                                   */
/* ------------------------------------------------------------------ */

export const getLedgerStats = unstable_cache(
  async () => {
    const leaders = await getLeaders({});
    const factChecks = await getFactChecks({ limit: 100 });
    const all = leaders.flatMap((l) => l.promises);
    return {
      promisesTracked: all.length,
      kept: all.filter((p) => p.status === 'kept').length,
      inProgress: all.filter((p) => p.status === 'in-progress').length,
      broken: all.filter((p) => p.status === 'broken').length,
      falseClaims: factChecks.filter((f) => f.rating === 'false').length,
    };
  },
  ['ledger-stats'],
  { tags: ['leaders', 'fact-checks'] },
);

export const getSettings = unstable_cache(
  async () => {
    const payload = await db();
    return payload.findGlobal({ slug: 'settings' });
  },
  ['site-settings'],
  { tags: ['settings'] },
);

/** Slugs for generateStaticParams — empty DB (e.g. CI) yields []. */
export async function listSlugs(
  collection: 'articles' | 'fact-checks' | 'leaders' | 'polls' | 'videos',
): Promise<string[]> {
  try {
    const payload = await db();
    // Drafts must never be prerendered — they build into baked 404s.
    const hasDrafts = collection === 'articles' || collection === 'fact-checks';
    const res = await payload.find({
      collection,
      where: hasDrafts ? { _status: { equals: 'published' } } : undefined,
      limit: 1000,
      depth: 0,
      select: { slug: true },
    });
    const slugs = res.docs
      .map((d) => (d as { slug?: string }).slug)
      .filter((s): s is string => Boolean(s));

    // Prerendering writes one file per slug, and Linux caps a filename at 255
    // bytes — a long Devanagari slug exceeds that and kills the whole build
    // with ENAMETOOLONG. New slugs are capped at source, but legacy rows must
    // never be able to break a deploy: skip them here and let them render on
    // demand instead. They stay fully reachable, just not prebuilt.
    const safe = slugs.filter(isPrerenderableSlug);
    if (safe.length !== slugs.length) {
      console.warn(
        `[listSlugs] ${slugs.length - safe.length} ${collection} slug(s) exceed ` +
          `${SLUG_MAX_BYTES} bytes and will render on demand instead of being prerendered.`,
      );
    }
    return safe;
  } catch {
    return [];
  }
}
