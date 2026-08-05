import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { POLITICIANS, FACT_CHECKS } from '@/lib/mock-data';

/**
 * The Ledger — the site's signature strip. A running national scoreboard of
 * promises and verdicts that says, in one glance, what this platform is for.
 */
export function AccountabilityLedger() {
  const allPromises = POLITICIANS.flatMap((p) => p.promises);
  const kept = allPromises.filter((p) => p.status === 'kept').length;
  const broken = allPromises.filter((p) => p.status === 'broken').length;
  const inProgress = allPromises.filter((p) => p.status === 'in-progress').length;
  const falseClaims = FACT_CHECKS.filter((f) => f.rating === 'false').length;

  const stats: { value: number; label: string; tone?: string; href: string }[] = [
    { value: allPromises.length, label: 'Promises tracked', href: '/leader' },
    { value: kept, label: 'Kept', tone: 'text-success', href: '/leader' },
    { value: inProgress, label: 'In progress', tone: 'text-warn', href: '/leader' },
    { value: broken, label: 'Broken', tone: 'text-danger', href: '/leader' },
    { value: falseClaims, label: 'False claims flagged', tone: 'text-danger', href: '/fact-check' },
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
            {stats.map((s) => (
              <div key={s.label} className="flex min-w-0 flex-col gap-1.5">
                <dt className="order-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                  {s.label}
                </dt>
                <dd
                  className={`order-1 font-serif text-3xl font-semibold leading-none md:text-4xl ${s.tone ?? 'text-ink'}`}
                >
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
