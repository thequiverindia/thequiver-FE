'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Newsletter waitlist form — stores the address, sends nothing (v1 policy).
 * variant 'pill' = rounded single-row (footer); 'split' = input + button (CTA).
 */
export function WaitlistForm({
  source,
  variant = 'pill',
  placeholder = 'you@example.com',
  buttonLabel = 'Subscribe',
  className,
}: {
  source: string;
  variant?: 'pill' | 'split';
  placeholder?: string;
  buttonLabel?: string;
  className?: string;
}) {
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (new FormData(form).get('email') as string) ?? '';
    setState('busy');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong');
      setState('done');
      setMessage("You're on the list — we'll write when the daily brief launches.");
      form.reset();
    } catch (err) {
      setState('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong — try again.');
    }
  }

  if (state === 'done') {
    return (
      <p role="status" className={cn('text-sm font-medium text-success', className)}>
        ✓ {message}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn('w-full', className)}>
      <div
        className={cn(
          variant === 'pill'
            ? 'flex items-center gap-2 rounded-full border border-line bg-bg p-1 pl-4 transition focus-within:border-line-strong'
            : 'flex gap-2',
        )}
      >
        {/* Honeypot — humans never see or fill this. */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="hidden"
        />
        <input
          type="email"
          name="email"
          required
          placeholder={placeholder}
          aria-label="Email address for the newsletter waitlist"
          className={cn(
            'min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-ink-subtle focus-visible:outline-none',
            variant === 'pill' ? 'py-2' : 'rounded-full border border-line bg-bg px-4 py-3 focus-ring',
          )}
        />
        <button
          type="submit"
          disabled={state === 'busy'}
          className={cn(
            'inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ink font-medium text-bg transition hover:bg-ink/90 active:bg-ink/80 focus-ring disabled:opacity-60',
            variant === 'pill' ? 'h-10 px-4 text-xs' : 'px-6 text-sm',
          )}
        >
          <Send className="h-3.5 w-3.5" aria-hidden />
          {state === 'busy' ? 'Saving…' : buttonLabel}
        </button>
      </div>
      {state === 'error' && (
        <p role="alert" className="mt-2 text-xs text-danger">
          {message}
        </p>
      )}
    </form>
  );
}
