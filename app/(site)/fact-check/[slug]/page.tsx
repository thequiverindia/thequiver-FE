import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { AuthorByline } from '@/components/article/AuthorByline';
import { FactCheckCard, ratingMeta } from '@/components/cards/FactCheckCard';
import { ShareBar } from '@/components/article/ShareBar';
import { ShareVerdict } from '@/components/fact-check/ShareVerdict';
import { getFactCheckBySlug, getFactChecks, listSlugs } from '@/lib/data';
import { cn, formatDateTime } from '@/lib/utils';

export async function generateStaticParams() {
  const slugs = await listSlugs('fact-checks');
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const fc = await getFactCheckBySlug(decodeURIComponent(params.slug));
  if (!fc) return { title: 'Fact check not found' };
  return { title: `Fact Check: ${fc.claim.slice(0, 60)}…`, description: fc.verdict };
}

export default async function FactCheckDetail(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const fc = await getFactCheckBySlug(decodeURIComponent(params.slug));
  if (!fc) notFound();
  const others = (await getFactChecks({ limit: 4 })).filter((f) => f.id !== fc.id).slice(0, 3);
  const meta = ratingMeta[fc.rating];

  return (
    <>
      <header className="border-b border-line bg-bg-subtle">
        <Container className="py-10">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Fact Check', href: '/fact-check' },
              { label: fc.claim.slice(0, 40) + '…' },
            ]}
          />
          <p className="kicker mt-6">TheQuiverIndia · Fact Check</p>
          <h1 className="mt-3 max-w-4xl text-balance font-serif text-[26px] font-semibold leading-tight text-ink sm:text-3xl md:text-5xl">
            &ldquo;{fc.claim}&rdquo;
          </h1>
          <p className="mt-3 text-sm text-ink-muted">
            Claim by <strong className="text-ink">{fc.claimant}</strong>
          </p>
        </Container>
      </header>

      <Container as="section" className="py-12">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {/* Verdict */}
            <div className={cn('rounded-2xl border-2 p-6 md:p-8', meta.panel)}>
              <p
                className={cn(
                  'text-[11px] font-semibold uppercase tracking-[0.16em]',
                  meta.text,
                )}
              >
                Our verdict
              </p>
              <p className={cn('stamp mt-4 text-2xl sm:text-3xl md:text-4xl', meta.text)}>
                {meta.label}
              </p>
              <p className="mt-6 text-pretty text-lg leading-relaxed text-ink">
                {fc.verdict}
              </p>
              <ShareVerdict claim={fc.claim} verdict={meta.label} />
            </div>

            {/* The image being fact-checked — it is the evidence, so describe it */}
            {fc.image && (
            <figure className="mt-8 overflow-hidden rounded-2xl bg-bg-muted">
              <div className="aspect-[16/9] w-full">
                <img
                  src={fc.image}
                  alt={`Viral image under review: ${fc.claim}`}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="px-4 py-3 text-xs text-ink-muted">
                The claim as it circulated. Verdict: {meta.label}.
              </figcaption>
            </figure>
            )}

            {/* Evidence */}
            <h2 className="mt-12 font-serif text-2xl font-semibold text-ink md:text-3xl">
              The evidence
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              Each point below is independently verifiable. Click sources at the bottom
              to inspect them yourself.
            </p>
            <ol className="mt-6 space-y-4">
              {fc.evidence.map((e, i) => (
                <li
                  key={i}
                  className="flex gap-4 rounded-xl border border-line bg-bg p-5"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-verified/10 text-verified">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <p className="text-sm leading-relaxed text-ink">{e}</p>
                </li>
              ))}
            </ol>

            {/* Sources */}
            <h2 className="mt-12 font-serif text-2xl font-semibold text-ink md:text-3xl">
              Sources
            </h2>
            <ul className="mt-4 space-y-2">
              {fc.sources.map((s, i) => (
                <li key={i}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border border-line bg-bg px-4 py-3 text-sm font-medium text-ink transition hover:border-line-strong hover:bg-bg-muted focus-ring"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-ink-muted" />
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Byline */}
            <div className="mt-12 flex items-center justify-between border-t border-line pt-6">
              <AuthorByline author={fc.author} />
              <p className="text-xs text-ink-muted">{formatDateTime(fc.publishedAt)}</p>
            </div>
            <div className="mt-6">
              <ShareBar />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:col-span-4">
            <div className="rounded-2xl border border-line bg-bg-subtle p-6">
              <ShieldCheck className="h-6 w-6 text-verified" />
              <p className="mt-4 font-serif text-lg leading-snug text-ink">
                How we rate claims
              </p>
              <ul className="mt-4 space-y-2 text-sm text-ink-muted">
                {Object.entries(ratingMeta).map(([k, m]) => (
                  <li key={k} className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2">
                      <span aria-hidden className={cn('h-2 w-2 rounded-full', m.dot)} />
                      <span className="text-ink">{m.label}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/about#fact-check"
                className="mt-5 inline-flex text-xs font-medium text-ink hover:underline"
              >
                Read full methodology →
              </Link>
            </div>
            <div className="rounded-2xl border border-line bg-bg p-6">
              <p className="kicker mb-3">More fact-checks</p>
              <div className="space-y-4">
                {others.map((o) => (
                  <FactCheckCard key={o.id} fc={o} variant="compact" />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
