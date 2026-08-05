import { notFound } from 'next/navigation';
import { Clock } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { PollCard } from '@/components/cards/PollCard';
import { PollVoting } from '@/components/engagement/PollVoting';
import { getPollBySlug, getPolls, listSlugs } from '@/lib/data';
import { getReaderPollVotes } from '@/lib/data/reader';
import { getReaderId } from '@/auth';
import { formatDateTime, formatNumber } from '@/lib/utils';

export async function generateStaticParams() {
  const slugs = await listSlugs('polls');
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const p = await getPollBySlug(decodeURIComponent(params.slug));
  if (!p) return { title: 'Poll not found' };
  return { title: `Poll: ${p.question}`, description: p.description };
}

export default async function PollDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const p = await getPollBySlug(decodeURIComponent(params.slug));
  if (!p) notFound();
  const others = (await getPolls()).filter((x) => x.id !== p.id).slice(0, 3);
  const readerId = await getReaderId();
  const votes = readerId ? await getReaderPollVotes(readerId) : {};

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
            <Badge tone="saffron">Reader poll</Badge>
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
            <PollVoting
              poll={p}
              votedOptionId={votes[p.id] ?? null}
              signedIn={Boolean(readerId)}
            />
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
