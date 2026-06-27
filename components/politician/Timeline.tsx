import { Award, AlertOctagon, Vote, MessageCircle } from 'lucide-react';
import type { PoliticianEvent } from '@/lib/types';
import { formatDate } from '@/lib/utils';

const kindMeta = {
  milestone: { label: 'Milestone', Icon: Award, color: '#1E1B4B' },
  controversy: { label: 'Controversy', Icon: AlertOctagon, color: '#DC2626' },
  election: { label: 'Election', Icon: Vote, color: '#15803D' },
  statement: { label: 'Statement', Icon: MessageCircle, color: '#EA580C' },
} as const;

export function Timeline({ events }: { events: PoliticianEvent[] }) {
  const sorted = [...events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  return (
    <ol className="relative ml-3 border-l border-line">
      {sorted.map((e, i) => {
        const meta = kindMeta[e.kind];
        return (
          <li key={i} className="relative pl-8 pb-8 last:pb-0">
            <span
              className="absolute -left-[15px] top-0 inline-flex h-7 w-7 items-center justify-center rounded-full ring-4 ring-bg"
              style={{ background: meta.color + '20', color: meta.color }}
            >
              <meta.Icon className="h-3.5 w-3.5" />
            </span>
            <p
              className="text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: meta.color }}
            >
              {meta.label} · {formatDate(e.date)}
            </p>
            <h4 className="mt-1 font-serif text-base font-semibold text-ink">
              {e.title}
            </h4>
            <p className="mt-1 text-sm text-ink-muted">{e.description}</p>
          </li>
        );
      })}
    </ol>
  );
}
