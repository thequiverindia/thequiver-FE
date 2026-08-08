import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { getLedgerStats } from '@/lib/data';

/**
 * The Ledger — the site's signature strip. A running national scoreboard of
 * promises and verdicts, computed live from the database.
 */
export async function AccountabilityLedger() {
  const s = await getLedgerStats();
  // Deliberately still renders at zero: this strip is the site's promise to
  // readers. Hiding it made the flagship feature invisible in production.

  const stats: { value: number; label: string; tone?: string }[] = [
    { value: s.promisesTracked, label: 'Promises tracked' },
    { value: s.kept, label: 'Kept', tone: 'text-success' },
    { value: s.inProgress, label: 'In progress', tone: 'text-warn' },
    { value: s.broken, label: 'Broken', tone: 'text-danger' },
    { value: s.falseClaims, label: 'False claims flagged', tone: 'text-danger' },
  ];

  return (
    <section
      aria-label="The Ledger — accountability scoreboard"
      className="border-y border-line bg-bg-subtle"
    >
      <Container className="py-8 md:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xs shrink-0">
            <p className="kicker">The Ledger</p>
            <h2 className="mt-2 font-serif text-xl font-semibold leading-snug text-ink md:text-2xl">
              We keep count so you don&rsquo;t have to.
            </h2>
            <Link
              href="/leader"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition hover:text-ink focus-ring rounded-sm"
            >
              How the Ledger works
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
          <dl className="grid flex-1 grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-5">
            {stats.map((stat) => (
              <div key={stat.label} className="flex min-w-0 flex-col gap-1.5">
                <dt className="order-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                  {stat.label}
                </dt>
                <dd
                  className={`order-1 font-serif text-3xl font-semibold leading-none md:text-4xl ${stat.tone ?? 'text-ink'}`}
                >
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
