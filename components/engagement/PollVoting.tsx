'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import type { Poll } from '@/lib/types';
import { cn, formatNumber } from '@/lib/utils';

/**
 * Interactive poll block: vote buttons for signed-in readers who haven't
 * voted; results (with "your vote" marked) once they have; closed state
 * after endsAt. The vote is one-per-reader, enforced server-side.
 */
export function PollVoting({
  poll,
  votedOptionId,
  signedIn,
}: {
  poll: Poll;
  votedOptionId: string | null;
  signedIn: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');
  const closed = new Date(poll.endsAt) < new Date();
  const showResults = closed || Boolean(votedOptionId) || !signedIn;

  async function vote(optionId: string) {
    setBusy(optionId);
    setError('');
    try {
      const res = await fetch('/api/polls/vote', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ poll: Number(poll.id), optionId }),
      });
      const d = await res.json();
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      if (!res.ok) throw new Error(d.error ?? 'Vote failed');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Vote failed — try again');
    } finally {
      setBusy(null);
    }
  }

  if (showResults) {
    const sorted = [...poll.options].sort((a, b) => b.votes - a.votes);
    const top = sorted[0];
    return (
      <div className="space-y-4">
        {sorted.map((opt) => {
          const pct = poll.totalVotes > 0 ? ((opt.votes / poll.totalVotes) * 100).toFixed(1) : '0.0';
          const isYours = opt.id === votedOptionId;
          return (
            <div key={opt.id}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="inline-flex items-center gap-2 font-medium text-ink">
                  {opt.id === top.id && (
                    <CheckCircle2 className="h-4 w-4 text-verified" aria-hidden />
                  )}
                  {opt.label}
                  {isYours && (
                    <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand">
                      Your vote
                    </span>
                  )}
                </span>
                <span className="text-ink-muted">
                  {pct}% · {formatNumber(opt.votes)} votes
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-bg-muted">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, background: opt.color ?? 'rgb(var(--brand))' }}
                />
              </div>
            </div>
          );
        })}
        {closed ? (
          <p className="rounded-xl border border-dashed border-line bg-bg-subtle p-3 text-center text-xs text-ink-muted">
            This poll has closed.
          </p>
        ) : votedOptionId ? (
          <p className="text-center text-xs text-ink-muted">
            Thanks for voting — results update as readers weigh in.
          </p>
        ) : (
          <p className="rounded-xl border border-dashed border-line bg-bg-subtle p-3 text-center text-sm text-ink-muted">
            <Link href="/login" className="font-medium text-ink underline">
              Sign in
            </Link>{' '}
            to cast your vote.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {poll.options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          disabled={busy !== null}
          onClick={() => vote(opt.id)}
          className="block w-full rounded-lg border border-line px-4 py-3 text-left text-sm font-medium text-ink transition hover:border-brand hover:bg-brand/5 active:bg-brand/10 focus-ring disabled:opacity-60"
        >
          {busy === opt.id ? 'Recording your vote…' : opt.label}
        </button>
      ))}
      {error && (
        <p role="alert" className="text-xs text-danger">
          {error}
        </p>
      )}
      <p className="text-xs text-ink-subtle">One vote per reader. You can’t change it later.</p>
    </div>
  );
}
