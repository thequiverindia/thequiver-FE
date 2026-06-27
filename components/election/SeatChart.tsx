import type { StateResult } from '@/lib/types';

export function SeatChart({ result }: { result: StateResult }) {
  return (
    <div>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-bg-muted">
        {result.results.map((p) => (
          <span
            key={p.party}
            style={{
              width: `${(p.seats / result.totalSeats) * 100}%`,
              background: p.partyColor,
            }}
            title={`${p.party}: ${p.seats}`}
          />
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm md:grid-cols-3">
        {result.results.map((p) => (
          <div key={p.party} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: p.partyColor }}
            />
            <span className="font-medium text-ink">{p.party}</span>
            <span className="text-ink-muted">
              {p.seats} · {p.vote_share}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function VoteShareBars({ result }: { result: StateResult }) {
  const max = Math.max(...result.results.map((r) => r.vote_share));
  return (
    <div className="space-y-3">
      {result.results.map((p) => (
        <div key={p.party}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="font-medium text-ink">{p.party}</span>
            <span className="text-ink-muted">{p.vote_share}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-bg-muted">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(p.vote_share / max) * 100}%`,
                background: p.partyColor,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
