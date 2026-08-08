'use client';

import { useEffect, useState } from 'react';

export type SessionUser = { name?: string | null; image?: string | null } | null;

/**
 * Shared client-side session state for the header and mobile menu.
 *
 * The session is fetched once per page and cached in module scope, so the
 * header avatar and the mobile menu agree with each other (previously the menu
 * always said "Sign in", even for a signed-in reader) without firing two
 * requests.
 */
let cache: { user: SessionUser; at: number } | null = null;
let inflight: Promise<SessionUser> | null = null;
const TTL = 60_000;

function load(): Promise<SessionUser> {
  if (cache && Date.now() - cache.at < TTL) return Promise.resolve(cache.user);
  if (inflight) return inflight;
  inflight = fetch('/api/auth/session')
    .then((r) => (r.ok ? r.json() : null))
    .then((s) => {
      const user = (s?.user ?? null) as SessionUser;
      cache = { user, at: Date.now() };
      return user;
    })
    .catch(() => null)
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

export function useReaderSession() {
  const [user, setUser] = useState<SessionUser>(cache?.user ?? null);
  const [loaded, setLoaded] = useState(Boolean(cache));

  useEffect(() => {
    let alive = true;
    load().then((u) => {
      if (!alive) return;
      setUser(u);
      setLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  return { user, loaded, signedIn: Boolean(user) };
}
