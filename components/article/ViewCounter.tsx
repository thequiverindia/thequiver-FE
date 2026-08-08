'use client';

import { useEffect } from 'react';

/**
 * Records one view per article per browser session. Fire-and-forget: it never
 * blocks rendering and failures are ignored. sessionStorage stops a reader
 * inflating the count by refreshing.
 */
export function ViewCounter({ articleId }: { articleId: string }) {
  useEffect(() => {
    const key = `viewed:${articleId}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
    } catch {
      // private mode — count it anyway
    }
    const id = window.setTimeout(() => {
      fetch('/api/views', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ article: Number(articleId) }),
        keepalive: true,
      }).catch(() => {});
    }, 2000); // only count readers who actually stayed
    return () => window.clearTimeout(id);
  }, [articleId]);

  return null;
}
