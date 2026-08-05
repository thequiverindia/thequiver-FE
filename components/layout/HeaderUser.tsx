'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type SessionUser = { name?: string | null; image?: string | null } | null;

/**
 * Session-aware header slot. Hydrates client-side (via the Auth.js session
 * endpoint) so the header — and every page it sits on — stays statically
 * cacheable for signed-out readers.
 */
export function HeaderUser() {
  const [user, setUser] = useState<SessionUser>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/auth/session')
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => setUser(s?.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoaded(true));
  }, []);

  if (loaded && user) {
    return (
      <Link
        href="/profile"
        aria-label={`Your profile${user.name ? ` — ${user.name}` : ''}`}
        className="ml-1 hidden h-10 w-10 items-center justify-center overflow-hidden rounded-full ring-1 ring-line transition hover:ring-line-strong focus-ring lg:inline-flex"
      >
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.image} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-sm font-medium text-ink">
            {(user.name ?? 'R').slice(0, 1).toUpperCase()}
          </span>
        )}
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      className="ml-1 hidden items-center rounded-full border border-line-strong px-4 py-2 text-sm font-medium text-ink transition hover:bg-bg-muted active:bg-bg-muted focus-ring lg:inline-flex"
    >
      Sign in
    </Link>
  );
}
