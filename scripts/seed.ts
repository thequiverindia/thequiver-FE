/**
 * One-time database seed from lib/mock-data.ts.
 *
 * Run with:  npm run seed   (payload run scripts/seed.ts)
 *
 * Everything flows through the real pipeline: images are downloaded and
 * pushed through the Media upload path (sharp resizing included), article
 * bodies are converted to Lexical rich text, and all relationships
 * (category, tags, author, party, fact-check links) are wired up.
 * Safe to re-run: aborts if content already exists.
 */
import { getPayload, type Payload } from 'payload';
import sharp from 'sharp';
import config from '../payload.config';

import {
  ARTICLES,
  AUTHORS,
  FACT_CHECKS,
  PARTIES,
  POLITICIANS,
  POLLS,
  VIDEOS,
} from '../lib/mock-data';
import { CATEGORIES, STATES } from '../lib/constants';
import { slugify } from '../collections/fields/slugField';

const ctx = { disableRevalidate: true };

/* ---------- media helper ---------- */

const PLACEHOLDER_COLORS = ['#1E1B4B', '#0E5E63', '#7A2E2E', '#334155', '#3F3F46'];
let placeholderIdx = 0;

async function createMedia(
  payload: Payload,
  url: string,
  alt: string,
): Promise<number> {
  let data: Buffer | null = null;
  let mimetype = 'image/jpeg';
  let name = `${slugify(alt).slice(0, 40) || 'image'}.jpg`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (res.ok) {
      data = Buffer.from(await res.arrayBuffer());
      const ct = res.headers.get('content-type');
      if (ct?.startsWith('image/')) {
        mimetype = ct.split(';')[0];
        if (mimetype === 'image/svg+xml') name = name.replace(/\.jpg$/, '.svg');
        if (mimetype === 'image/png') name = name.replace(/\.jpg$/, '.png');
        if (mimetype === 'image/webp') name = name.replace(/\.jpg$/, '.webp');
      }
    }
  } catch {
    // offline / blocked — fall through to generated placeholder
  }

  let fileData: Buffer;
  if (data && data.length > 0) {
    fileData = data;
  } else {
    const background = PLACEHOLDER_COLORS[placeholderIdx++ % PLACEHOLDER_COLORS.length];
    fileData = await sharp({
      create: { width: 1600, height: 900, channels: 3, background },
    })
      .jpeg({ quality: 70 })
      .toBuffer();
    mimetype = 'image/jpeg';
  }

  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    file: { data: fileData, mimetype, name, size: fileData.length },
    context: ctx,
  });
  return doc.id as number;
}

/* ---------- lexical rich-text builders ---------- */

type LexNode = { [k: string]: unknown; type: string; version: number };

const textNode = (text: string): LexNode => ({
  type: 'text',
  version: 1,
  text,
  format: 0,
  style: '',
  mode: 'normal',
  detail: 0,
});

const block = (
  type: string,
  children: LexNode[],
  extra: Record<string, unknown> = {},
): LexNode => ({
  type,
  version: 1,
  format: '',
  indent: 0,
  direction: 'ltr',
  children,
  ...extra,
});

function bodyToLexical(blocks: (typeof ARTICLES)[number]['body']) {
  const children: LexNode[] = [];
  for (const b of blocks) {
    switch (b.type) {
      case 'p':
        children.push(block('paragraph', [textNode(b.text)], { textFormat: 0 }));
        break;
      case 'h2':
        children.push(block('heading', [textNode(b.text)], { tag: 'h2' }));
        break;
      case 'h3':
        children.push(block('heading', [textNode(b.text)], { tag: 'h3' }));
        break;
      case 'quote':
        children.push(
          block('quote', [textNode(b.cite ? `${b.text} — ${b.cite}` : b.text)]),
        );
        break;
      case 'list':
        children.push(
          block(
            'list',
            b.items.map((item, i) =>
              block('listitem', [textNode(item)], { value: i + 1 }),
            ),
            {
              listType: b.ordered ? 'number' : 'bullet',
              tag: b.ordered ? 'ol' : 'ul',
              start: 1,
            },
          ),
        );
        break;
      case 'callout':
        children.push(block('paragraph', [textNode(b.text)], { textFormat: 0 }));
        break;
      case 'stat':
        children.push(
          block('paragraph', [textNode(`${b.label}: ${b.value}${b.sub ? ` (${b.sub})` : ''}`)], {
            textFormat: 0,
          }),
        );
        break;
      case 'image':
        // Body images are skipped in the seed — hero images cover visuals.
        break;
    }
  }
  return {
    root: {
      type: 'root',
      version: 1,
      format: '' as const,
      indent: 0,
      direction: 'ltr' as const,
      children,
    },
  };
}

/** Narrow a free-text state string to the select union (or undefined). */
function asState<T extends string>(state: string | undefined, options: readonly T[]): T | undefined {
  return options.includes(state as T) ? (state as T) : undefined;
}

/* ---------- seed ---------- */

async function seed() {
  const payload = await getPayload({ config });

  const existing = await payload.count({ collection: 'categories' });
  if (existing.totalDocs > 0) {
    payload.logger.info('Database already has content — seed aborted (nothing changed).');
    process.exit(0);
  }

  payload.logger.info('Seeding: settings…');
  await payload.updateGlobal({
    slug: 'settings',
    data: {
      siteName: 'TheQuiverIndia',
      tagline: 'Politics. Power. People.',
      socials: { instagram: 'thequiverindia', youtube: '@thequiverindia' },
    },
    context: ctx,
  });

  payload.logger.info('Seeding: categories…');
  const categoryId: Record<string, number> = {};
  for (const c of CATEGORIES) {
    const doc = await payload.create({
      collection: 'categories',
      data: { label: c.label, slug: c.slug, description: c.description },
      context: ctx,
    });
    categoryId[c.slug] = doc.id as number;
  }

  payload.logger.info('Seeding: tags…');
  const tagId: Record<string, number> = {};
  const allTagLabels = new Set<string>(ARTICLES.flatMap((a) => a.tags));
  for (const label of allTagLabels) {
    const slug = slugify(label);
    if (tagId[slug]) continue;
    const doc = await payload.create({
      collection: 'tags',
      data: { label, slug },
      context: ctx,
    });
    tagId[slug] = doc.id as number;
  }

  payload.logger.info('Seeding: authors (with avatars)…');
  const authorId: Record<string, number> = {};
  for (const a of AUTHORS) {
    const avatar = await createMedia(payload, a.avatar, `Portrait of ${a.name}`);
    const doc = await payload.create({
      collection: 'authors',
      data: {
        name: a.name,
        slug: slugify(a.name),
        handle: a.handle,
        role: a.role,
        bio: a.bio,
        avatar,
      },
      context: ctx,
    });
    authorId[a.id] = doc.id as number;
  }

  payload.logger.info('Seeding: parties…');
  const partyId: Record<string, number> = {};
  for (const p of PARTIES) {
    const doc = await payload.create({
      collection: 'parties',
      data: {
        name: p.name,
        short: p.short,
        slug: p.slug,
        color: p.color,
        founded: p.founded,
        ideology: p.ideology,
        leader: p.leader,
        seats: p.seats,
      },
      context: ctx,
    });
    partyId[p.short] = doc.id as number;
  }

  payload.logger.info('Seeding: leaders (with photos)…');
  const leaderDocs: { id: number; name: string }[] = [];
  for (const p of POLITICIANS) {
    // Some politicians reference parties missing from PARTIES — create them.
    if (!partyId[p.partyShort]) {
      const created = await payload.create({
        collection: 'parties',
        data: {
          name: p.party,
          short: p.partyShort,
          slug: slugify(p.party),
          color: p.partyColor,
        },
        context: ctx,
      });
      partyId[p.partyShort] = created.id as number;
    }
    const photo = await createMedia(payload, p.image, `Photo of ${p.name}`);
    const doc = await payload.create({
      collection: 'leaders',
      data: {
        name: p.name,
        slug: p.slug,
        party: partyId[p.partyShort],
        position: p.position,
        constituency: p.constituency,
        state: asState(p.state, STATES),
        age: p.age,
        photo,
        bio: p.bio,
        rating: p.rating,
        followers: p.followers,
        attendance: p.attendance,
        questionsAsked: p.questionsAsked,
        netWorth: p.net_worth,
        criminalCases: p.criminalCases,
        education: p.education,
        socials: p.socials,
        promises: p.promises.map((pr) => ({
          text: pr.text,
          status: pr.status,
          madeOn: pr.madeOn,
          context: pr.context,
        })),
        timeline: p.timeline.map((t) => ({
          date: t.date,
          kind: t.kind,
          title: t.title,
          description: t.description,
        })),
      },
      context: ctx,
    });
    leaderDocs.push({ id: doc.id as number, name: p.name });
  }

  payload.logger.info('Seeding: fact-checks (with images)…');
  const factCheckId: Record<string, number> = {};
  for (const fc of FACT_CHECKS) {
    const image = await createMedia(
      payload,
      fc.image,
      `Viral image under review: ${fc.claim.slice(0, 80)}`,
    );
    const doc = await payload.create({
      collection: 'fact-checks',
      data: {
        claim: fc.claim,
        slug: fc.slug,
        language: 'en',
        claimant: fc.claimant,
        rating: fc.rating,
        verdict: fc.verdict,
        evidence: fc.evidence.map((point) => ({ point })),
        sources: fc.sources,
        image,
        author: authorId[fc.author.id],
        publishedAt: fc.publishedAt,
        views: fc.views,
        _status: 'published',
      },
      context: ctx,
    });
    factCheckId[fc.slug] = doc.id as number;
  }

  payload.logger.info('Seeding: articles (with hero images)…');
  const articleId: Record<string, number> = {};
  for (const a of ARTICLES) {
    const heroImage = await createMedia(payload, a.image, a.imageCaption ?? a.title);
    const mentioned = leaderDocs
      .filter((l) => `${a.title} ${a.excerpt}`.toLowerCase().includes(l.name.toLowerCase()))
      .map((l) => l.id);
    const doc = await payload.create({
      collection: 'articles',
      data: {
        title: a.title,
        slug: a.slug,
        language: 'en',
        kicker: a.kicker,
        excerpt: a.excerpt,
        heroImage,
        imageCaption: a.imageCaption,
        body: bodyToLexical(a.body),
        category: categoryId[a.category],
        tags: a.tags.map((t) => tagId[slugify(t)]).filter(Boolean),
        author: authorId[a.author.id],
        verification: a.verification,
        sourceCount: a.sourceCount,
        factCheck: a.factCheckId ? factCheckId[a.factCheckId] : undefined,
        mentionedLeaders: mentioned,
        isExclusive: a.isExclusive ?? false,
        publishedAt: a.publishedAt,
        views: a.views,
        _status: 'published',
      },
      context: ctx,
    });
    articleId[a.id] = doc.id as number;
  }

  // Second pass: hand-picked related links from the mock data.
  for (const a of ARTICLES) {
    if (!a.relatedIds?.length) continue;
    const related = a.relatedIds.map((rid) => articleId[rid]).filter(Boolean);
    if (related.length === 0) continue;
    await payload.update({
      collection: 'articles',
      id: articleId[a.id],
      data: { related },
      context: ctx,
    });
  }

  payload.logger.info('Seeding: polls…');
  for (const p of POLLS) {
    await payload.create({
      collection: 'polls',
      data: {
        question: p.question,
        slug: p.slug,
        description: p.description,
        category: (['politics', 'elections', 'opinion', 'trending'].includes(p.category)
          ? p.category
          : 'politics') as 'politics' | 'elections' | 'opinion' | 'trending',
        state: asState(p.state, STATES),
        options: p.options.map((o) => ({ label: o.label, votes: o.votes, color: o.color })),
        totalVotes: p.totalVotes,
        endsAt: p.endsAt,
      },
      context: ctx,
    });
  }

  payload.logger.info('Seeding: videos…');
  let vi = 0;
  for (const v of VIDEOS) {
    await payload.create({
      collection: 'videos',
      data: {
        title: v.title,
        slug: v.slug,
        // Placeholder IDs — replaced with real ones by the YouTube sync (M4).
        youtubeId: `seed-placeholder-${vi++}`,
        description: v.description,
        thumbnailUrl: v.thumbnail,
        duration: v.duration,
        series: v.series,
        host: v.host,
        publishedAt: v.publishedAt,
        views: v.views,
        source: 'manual',
        featured: vi === 1,
      },
      context: ctx,
    });
  }

  const counts = await Promise.all(
    (['articles', 'fact-checks', 'leaders', 'parties', 'polls', 'videos', 'authors', 'tags', 'categories', 'media'] as const).map(
      async (c) => `${c}: ${(await payload.count({ collection: c })).totalDocs}`,
    ),
  );
  payload.logger.info(`Seed complete — ${counts.join(' · ')}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
