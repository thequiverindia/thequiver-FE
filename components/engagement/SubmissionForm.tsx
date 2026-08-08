'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

type Field = {
  name: 'name' | 'email' | 'subject' | 'message' | 'sourceUrl';
  label: string;
  type?: 'text' | 'email' | 'url' | 'textarea';
  placeholder?: string;
  required?: boolean;
  rows?: number;
};

/**
 * Real, submitting form for reader messages. Replaces MockForm, which called
 * preventDefault() and silently discarded everything the reader wrote.
 */
export function SubmissionForm({
  kind,
  fields,
  submitLabel = 'Send',
  successMessage = 'Thanks — your message has reached our newsroom.',
  className,
}: {
  kind: 'contact' | 'claim' | 'advertising';
  fields: Field[];
  submitLabel?: string;
  successMessage?: string;
  className?: string;
}) {
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setState('busy');
    setError('');
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          kind,
          name: fd.get('name') ?? '',
          email: fd.get('email') ?? '',
          subject: fd.get('subject') ?? '',
          message: fd.get('message') ?? '',
          sourceUrl: fd.get('sourceUrl') ?? '',
          website: fd.get('website') ?? '',
        }),
      });
      // Read the body defensively: a 500 may not be JSON at all.
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? 'Could not send your message.');
      setState('done');
      form.reset();
    } catch (err) {
      setState('error');
      setError(err instanceof Error ? err.message : 'Could not send your message.');
    }
  }

  if (state === 'done') {
    return (
      <p
        role="status"
        className={cn(
          'rounded-xl border border-verified/30 bg-verified/5 p-4 text-sm text-ink',
          className,
        )}
      >
        ✓ {successMessage}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn('space-y-4', className)}>
      {/* Honeypot — hidden from humans, irresistible to bots. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      {fields.map((f) => (
        <label key={f.name} className="block">
          <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-ink-muted">
            {f.label}
          </span>
          {f.type === 'textarea' ? (
            <textarea
              name={f.name}
              rows={f.rows ?? 4}
              required={f.required}
              placeholder={f.placeholder}
              className="w-full rounded-lg border border-line bg-bg p-3 text-sm text-ink placeholder:text-ink-subtle focus-ring"
            />
          ) : (
            <input
              type={f.type ?? 'text'}
              name={f.name}
              required={f.required}
              placeholder={f.placeholder}
              className="w-full rounded-lg border border-line bg-bg p-3 text-sm text-ink placeholder:text-ink-subtle focus-ring"
            />
          )}
        </label>
      ))}

      <button
        type="submit"
        disabled={state === 'busy'}
        className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-bg transition hover:bg-ink/90 active:bg-ink/80 focus-ring disabled:opacity-60"
      >
        <Send className="h-3.5 w-3.5" aria-hidden />
        {state === 'busy' ? 'Sending…' : submitLabel}
      </button>

      {state === 'error' && (
        <p role="alert" className="text-xs text-danger">
          {error}
        </p>
      )}
    </form>
  );
}
