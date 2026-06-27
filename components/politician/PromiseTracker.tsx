import { CheckCircle2, XCircle, Clock, HelpCircle } from 'lucide-react';
import type { PoliticianPromise, PromiseStatus } from '@/lib/types';
import { formatDate } from '@/lib/utils';

const statusMeta: Record<
  PromiseStatus,
  { label: string; color: string; bg: string; Icon: typeof CheckCircle2 }
> = {
  kept: {
    label: 'Kept',
    color: '#15803D',
    bg: 'rgba(21,128,61,0.1)',
    Icon: CheckCircle2,
  },
  broken: {
    label: 'Broken',
    color: '#DC2626',
    bg: 'rgba(220,38,38,0.1)',
    Icon: XCircle,
  },
  'in-progress': {
    label: 'In Progress',
    color: '#EA580C',
    bg: 'rgba(234,88,12,0.1)',
    Icon: Clock,
  },
  unverifiable: {
    label: 'Unverifiable',
    color: '#737373',
    bg: 'rgba(115,115,115,0.1)',
    Icon: HelpCircle,
  },
};

export function PromiseTracker({ promises }: { promises: PoliticianPromise[] }) {
  const counts = {
    kept: promises.filter((p) => p.status === 'kept').length,
    'in-progress': promises.filter((p) => p.status === 'in-progress').length,
    broken: promises.filter((p) => p.status === 'broken').length,
    unverifiable: promises.filter((p) => p.status === 'unverifiable').length,
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {(['kept', 'in-progress', 'broken', 'unverifiable'] as PromiseStatus[]).map((s) => {
          const meta = statusMeta[s];
          return (
            <div
              key={s}
              className="rounded-xl border border-line bg-bg p-4"
              style={{ borderColor: counts[s] > 0 ? meta.color + '30' : undefined }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full"
                  style={{ background: meta.bg, color: meta.color }}
                >
                  <meta.Icon className="h-3.5 w-3.5" />
                </span>
                <p className="text-[10px] uppercase tracking-wider text-ink-muted">
                  {meta.label}
                </p>
              </div>
              <p className="mt-2 font-serif text-3xl font-semibold text-ink">
                {counts[s]}
              </p>
            </div>
          );
        })}
      </div>

      <ul className="mt-8 space-y-3">
        {promises.map((p) => {
          const meta = statusMeta[p.status];
          return (
            <li
              key={p.id}
              className="flex items-start gap-4 rounded-xl border border-line bg-bg p-4"
            >
              <span
                className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                style={{ background: meta.bg, color: meta.color }}
              >
                <meta.Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-snug text-ink">{p.text}</p>
                <p className="mt-1 text-xs text-ink-muted">
                  <span
                    className="font-semibold uppercase tracking-wider"
                    style={{ color: meta.color }}
                  >
                    {meta.label}
                  </span>{' '}
                  · Promised {formatDate(p.madeOn)}
                  {p.context && <> · {p.context}</>}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
