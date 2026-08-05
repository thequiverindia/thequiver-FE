import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Clock } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { PollCard } from '@/components/cards/PollCard';
import { getPollBySlug, getPolls, listSlugs } from '@/lib/data';
import { formatDateTime, formatNumber } from '@/lib/utils';

export async function generateStaticParams() {
  const slugs = await listSlugs('polls');
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const p = await getPollBySlug(params.slug);
  if (!p) return { title: 'Poll not found' };
  return { title: `Poll: ${p.question}`, description: p.description };
}

export default async function PollDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const p = await getPollBySlug(params.slug);
  if (!p) notFound();
  const others = (await getPolls()).filter((x) => x.id !== p.id).slice(0, 3);
  const top = [...p.options].sort((a, b) => b.votes - a.votes)[0];

  return (
    <Container as="section" className="py-8 lg:py-12">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Polls', href: '/polls' },
          { label: p.question.slice(0, 40) + '…' },
        ]}
      />

      <div className="mt-8 grid gap-10 lg:grid-cols-12">
        <article className="lg:col-span-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="saffron">Live poll</Badge>
            <Badge tone="neutral">{p.category}</Badge>
            {p.state && <Badge tone="neutral">{p.state}</Badge>}
          </div>
          <h1 className="mt-4 text-balance font-serif text-3xl font-semibold leading-tight text-ink md:text-4xl">
            {p.question}
          </h1>
          {p.description && (
            <p className="mt-3 text-lg text-ink-muted">{p.description}</p>
          )}

          <div className="mt-8 rounded-2xl border border-line bg-bg p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between text-sm">
              <span className="text-ink-muted">
                {formatNumber(p.totalVotes)} total votes
              </span>
              <span className="inline-flex items-center gap-1.5 text-ink-muted">
                <Clock className="h-3.5 w-3.5" />
                Ends {formatDateTime(p.endsAt)}
              </span>
            </div>
            <div className="space-y-4">
              {p.options
                .slice()
                .sort((a, b) => b.votes - a.votes)
                .map((opt) => {
                  const pct = ((opt.votes / p.totalVotes) * 100).toFixed(1);
                  const isTop = opt.id === top.id;
                  return (
                    <div key={opt.id}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="inline-flex items-center gap-2 font-medium text-ink">
                          {isTop && <CheckCircle2 className="h-4 w-4 text-verified" />}
                          {opt.label}
                        </span>
                        <span className="text-ink-muted">
                          {pct}% · {formatNumber(opt.votes)} votes
                        </span>
                      </div>
                      <div className="h-3 w-full overflow-hidden rounded-full bg-bg-muted">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${pct}%`,
                            background: opt.color ?? 'rgb(var(--brand))',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className="mt-8 rounded-xl border border-dashed border-line bg-bg-subtle p-4 text-center text-sm text-ink-muted">
              You haven't voted yet.{' '}
              <Link href="/login" className="font-medium text-ink underline">
                Sign in to vote
              </Link>
            </div>
          </div>

          <section className="mt-12 rounded-2xl border border-line bg-bg-subtle p-6">
            <p className="kicker mb-3">Methodology</p>
            <p className="text-sm leading-relaxed text-ink-muted">
              TheQuiverIndia polls are open to verified readers only. Each reader can vote once
              per poll. Results are weighted only by recency (newest votes carry no
              additional weight). We do not predict outcomes — we surface what readers say.
            </p>
          </section>
        </article>

        <aside className="lg:col-span-4">
          <p className="kicker mb-4">More polls</p>
          <div className="space-y-4">
            {others.map((o) => (
              <PollCard key={o.id} poll={o} variant="inline" />
            ))}
          </div>
        </aside>
      </div>
    </Container>
  );
}
