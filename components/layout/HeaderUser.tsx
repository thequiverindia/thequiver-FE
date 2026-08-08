'use client';

import Link from 'next/link';
import { useReaderSession } from './useReaderSession';

/**
 * Session-aware header slot. Hydrates client-side so every page stays
 * statically cacheable for signed-out readers.
 *
 * Renders a fixed-size slot in all three states (loading / signed in / signed
 * out) so the header never shifts as the session resolves.
 */
export function HeaderUser() {
  const { user, loaded } = useReaderSession();

  if (!loaded) {
    return (
      <span
        aria-hidden
        className="ml-1 hidden h-10 w-10 shrink-0 animate-pulse rounded-full bg-bg-muted lg:inline-block"
      />
    );
  }

  if (user) {
    return (
      <Link
        href="/profile"
        aria-label={`Your profile${user.name ? ` — ${user.name}` : ''}`}
        title={user.name ?? 'Your profile'}
        className="ml-1 hidden h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ring-line transition hover:ring-brand focus-ring lg:inline-flex"
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
      className="ml-1 hidden shrink-0 items-center rounded-full bg-brand px-4 py-2 text-sm font-semibold text-bg transition hover:bg-brand-soft active:bg-brand-soft focus-ring lg:inline-flex"
    >
      Sign in
    </Link>
  );
}
