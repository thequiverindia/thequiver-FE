'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Save/unsave an article. Hydrates its state client-side so article pages
 * stay statically cached for everyone.
 */
export function BookmarkButton({ articleId, className }: { articleId: string; className?: string }) {
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState(false);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch(`/api/bookmarks?article=${articleId}`)
      .then((r) => r.json())
      .then((d) => {
        setBookmarked(Boolean(d.bookmarked));
        setSignedIn(Boolean(d.signedIn));
      })
      .catch(() => setSignedIn(false));
  }, [articleId]);

  async function toggle() {
    if (signedIn === false) {
      router.push('/login');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ article: Number(articleId) }),
      });
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      const d = await res.json();
      setBookmarked(Boolean(d.bookmarked));
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={bookmarked}
      aria-label={bookmarked ? 'Remove bookmark' : 'Save this story'}
      title={bookmarked ? 'Saved' : 'Save'}
      className={cn(
        'inline-flex h-11 items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition focus-ring disabled:opacity-60',
        bookmarked
          ? 'border-brand/40 bg-brand/10 text-brand'
          : 'border-line bg-bg text-ink-muted hover:border-line-strong hover:bg-bg-muted hover:text-ink',
        className,
      )}
    >
      <Bookmark className={cn('h-4 w-4', bookmarked && 'fill-current')} aria-hidden />
      {bookmarked ? 'Saved' : 'Save'}
    </button>
  );
}
