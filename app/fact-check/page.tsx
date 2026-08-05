import Link from 'next/link';
import { ShieldCheck, Send, Search } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Tabs } from '@/components/ui/Tabs';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FactCheckCard } from '@/components/cards/FactCheckCard';
import { MockForm } from '@/components/ui/MockForm';
import { FACT_CHECKS } from '@/lib/mock-data';

export const metadata = {
  title: 'Fact Check — Verified claims, rated and sourced',
  description:
    'Every viral claim, rated and explained with sources. Submit a claim for verification.',
};

const COUNTS = {
  total: FACT_CHECKS.length,
  false: FACT_CHECKS.filter((f) => f.rating === 'false').length,
  misleading: FACT_CHECKS.filter((f) => f.rating === 'misleading').length,
  mostlyTrue: FACT_CHECKS.filter((f) => f.rating === 'mostly-true').length,
};

const RATING_TAB_LABELS: Record<string, string> = {
  false: 'False',
  misleading: 'Misleading',
  'mostly-true': 'Mostly True',
};

export default function FactCheckPage({
  searchParams,
}: {
  searchParams?: { rating?: string; q?: string };
}) {
  const rating = searchParams?.rating;
  const q = searchParams?.q?.trim().toLowerCase();
  const filtered = FACT_CHECKS.filter((fc) => {
    if (rating && fc.rating !== rating) return false;
    if (
      q &&
      !fc.claim.toLowerCase().includes(q) &&
      !fc.claimant.toLowerCase().includes(q)
    )
      return false;
    return true;
  });

  return (
    <>
      <header className="border-b border-line bg-bg-subtle">
        <Container className="py-12">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Fact Check' }]} />
          <div className="mt-6 grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="kicker">TheQuiverIndia · Fact Check</p>
              <h1 className="mt-3 font-serif text-3xl font-semibold text-ink sm:text-4xl md:text-5xl">
                Verified claims, sourced evidence, plain verdicts.
              </h1>
              <p className="mt-4 max-w-2xl text-base text-ink-muted sm:text-lg">
                We rate every claim against the evidence we can publicly show. Read the
                methodology, then submit your own claim for verification.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="#submit"
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-bg hover:bg-ink/90"
                >
                  <Send className="h-3.5 w-3.5" />
                  Submit a claim
                </Link>
                <Link
                  href="/about#fact-check"
                  className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-bg px-5 py-2.5 text-sm font-medium text-ink hover:bg-bg-muted"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Read methodology
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 lg:col-span-5">
              <StatBox label="Claims checked" value={COUNTS.total.toString()} />
              <StatBox label="Rated false" value={COUNTS.false.toString()} tone="false" />
              <StatBox label="Misleading" value={COUNTS.misleading.toString()} tone="warn" />
              <StatBox label="Mostly true" value={COUNTS.mostlyTrue.toString()} tone="ok" />
            </div>
          </div>
        </Container>
      </header>

      <Container className="pt-8">
        <form action="/fact-check" role="search" className="flex items-center gap-2 rounded-full border border-line bg-bg p-1 pl-4 focus-within:border-line-strong">
          <Search className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden />
          <input
            type="search"
            name="q"
            defaultValue={searchParams?.q ?? ''}
            aria-label="Search claims and claimants"
            placeholder="Search claims, sources, claimants…"
            className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-ink placeholder:text-ink-subtle focus-visible:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg transition hover:bg-ink/90 active:bg-ink/80 focus-ring"
          >
            Search
          </button>
        </form>
        <Tabs
          className="mt-6"
          active={rating ? RATING_TAB_LABELS[rating] ?? 'All' : 'All'}
          items={[
            { label: 'All', href: '/fact-check', count: COUNTS.total },
            { label: 'False', href: '/fact-check?rating=false', count: COUNTS.false },
            { label: 'Misleading', href: '/fact-check?rating=misleading', count: COUNTS.misleading },
            { label: 'Mostly True', href: '/fact-check?rating=mostly-true', count: COUNTS.mostlyTrue },
          ]}
        />
      </Container>

      <Container as="section" className="py-12">
        {filtered.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line bg-bg-subtle p-8 text-center text-sm text-ink-muted">
            No fact-checks match{q ? ` “${searchParams?.q}”` : ' this filter'}.{' '}
            <Link href="/fact-check" className="font-medium text-ink underline">
              Clear filters
            </Link>
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((fc) => (
              <FactCheckCard key={fc.id} fc={fc} />
            ))}
          </div>
        )}
      </Container>

      {/* Submit */}
      <section id="submit" className="border-y border-line bg-bg-subtle">
        <Container className="py-16">
          <div className="mx-auto max-w-2xl">
            <SectionHeader
              kicker="Citizen submissions"
              title="Send us a claim to verify"
              description="Forwarded WhatsApp messages, suspicious infographics, edited videos — drop the link below."
              className="!mb-6"
            />
            <MockForm
              className="space-y-4 rounded-2xl border border-line bg-bg p-6"
            >
              <Field label="What's the claim?">
                <textarea
                  rows={3}
                  placeholder="Paste the text, or describe the claim in your own words"
                  className="w-full rounded-lg border border-line bg-bg p-3 text-sm focus-ring"
                />
              </Field>
              <Field label="Where did you see it?">
                <input
                  type="url"
                  placeholder="https://…"
                  className="w-full rounded-lg border border-line bg-bg p-3 text-sm focus-ring"
                />
              </Field>
              <Field label="Your email (so we can update you)">
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-line bg-bg p-3 text-sm focus-ring"
                />
              </Field>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-bg hover:bg-ink/90"
              >
                <Send className="h-3.5 w-3.5" />
                Submit for verification
              </button>
            </MockForm>
          </div>
        </Container>
      </section>
    </>
  );
}

function StatBox({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: 'false' | 'warn' | 'ok';
}) {
  const colors = {
    false: 'text-danger',
    warn: 'text-warn',
    ok: 'text-success',
  };
  return (
    <div className="rounded-xl border border-line bg-bg p-5">
      <p className="text-[10px] uppercase tracking-wider text-ink-muted">{label}</p>
      <p
        className={`mt-2 font-serif text-3xl font-semibold md:text-4xl ${
          tone ? colors[tone] : 'text-ink'
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-ink-muted">
        {label}
      </span>
      {children}
    </label>
  );
}
