import { Award, AlertOctagon, Vote, MessageCircle } from 'lucide-react';
import type { PoliticianEvent } from '@/lib/types';
import { cn, formatDate } from '@/lib/utils';

const kindMeta = {
  milestone: { label: 'Milestone', Icon: Award, text: 'text-brand', chip: 'bg-brand/10 text-brand' },
  controversy: { label: 'Controversy', Icon: AlertOctagon, text: 'text-danger', chip: 'bg-danger/10 text-danger' },
  election: { label: 'Election', Icon: Vote, text: 'text-success', chip: 'bg-success/10 text-success' },
  statement: { label: 'Statement', Icon: MessageCircle, text: 'text-warn', chip: 'bg-warn/10 text-warn' },
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
              className={cn(
                'absolute -left-[15px] top-0 inline-flex h-7 w-7 items-center justify-center rounded-full ring-4 ring-bg',
                meta.chip,
              )}
            >
              <meta.Icon className="h-3.5 w-3.5" />
            </span>
            <p
              className={cn(
                'text-[10px] font-semibold uppercase tracking-wider',
                meta.text,
              )}
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
