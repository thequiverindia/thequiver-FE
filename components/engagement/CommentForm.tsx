'use client';

import { useState } from 'react';
import Link from 'next/link';

/** Post a comment — lands in the moderation queue, with honest feedback. */
export function CommentForm({ articleId }: { articleId: string }) {
  const [state, setState] = useState<'idle' | 'busy' | 'pending' | 'error' | 'signin'>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const body = (new FormData(form).get('body') as string) ?? '';
    setState('busy');
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ article: Number(articleId), body }),
      });
      const data = await res.json();
      if (res.status === 401) {
        setState('signin');
        return;
      }
      if (!res.ok) throw new Error(data.error ?? 'Could not post your comment');
      setState('pending');
      form.reset();
    } catch (err) {
      setState('error');
      setMessage(err instanceof Error ? err.message : 'Could not post your comment');
    }
  }

  if (state === 'pending') {
    return (
      <p
        role="status"
        className="rounded-xl border border-verified/30 bg-verified/5 p-4 text-sm text-ink"
      >
        ✓ Thanks — your comment is <strong>awaiting moderation</strong> and will appear
        once an editor approves it.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <textarea
        name="body"
        required
        minLength={2}
        maxLength={2000}
        rows={3}
        aria-label="Write a comment"
        placeholder="Add to the discussion — comments are moderated before they appear."
        className="mt-4 w-full rounded-lg border border-line bg-bg p-3 text-sm text-ink placeholder:text-ink-subtle focus-ring"
      />
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-xs text-ink-subtle">Be respectful. No abuse, no misinformation.</p>
        <button
          type="submit"
          disabled={state === 'busy'}
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-bg transition hover:bg-ink/90 active:bg-ink/80 focus-ring disabled:opacity-60"
        >
          {state === 'busy' ? 'Posting…' : 'Post comment'}
        </button>
      </div>
      {state === 'signin' && (
        <p role="alert" className="mt-2 text-sm text-ink-muted">
          <Link href="/login" className="font-medium text-ink underline">
            Sign in with Google
          </Link>{' '}
          to join the discussion.
        </p>
      )}
      {state === 'error' && (
        <p role="alert" className="mt-2 text-xs text-danger">
          {message}
        </p>
      )}
    </form>
  );
}
