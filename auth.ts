import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { getPayload } from 'payload';
import config from '@payload-config';

/**
 * Reader authentication — Google only (no passwords, no emails to send).
 * Sessions are JWTs (no session table needed). On first sign-in a row is
 * created in the Readers collection; its id rides along in the token so API
 * routes can attach comments/votes/bookmarks to it.
 */

/**
 * Find-or-create the Readers row for an email, tolerating the race where two
 * sign-ins arrive at once (the unique index rejects the loser, which then
 * re-reads the winner's row instead of failing).
 */
async function resolveReaderId(
  email: string,
  name?: string | null,
  avatarUrl?: string | null,
  refresh = false,
): Promise<number | null> {
  const payload = await getPayload({ config });
  const found = await payload.find({
    collection: 'readers',
    where: { email: { equals: email } },
    limit: 1,
    depth: 0,
  });

  if (found.docs[0]) {
    const id = found.docs[0].id;
    if (refresh) {
      await payload
        .update({
          collection: 'readers',
          id,
          data: { name: name ?? undefined, avatarUrl: avatarUrl ?? undefined },
          context: { disableRevalidate: true },
        })
        .catch(() => null); // cosmetic refresh — never block sign-in
    }
    return id;
  }

  try {
    const created = await payload.create({
      collection: 'readers',
      data: { email, name: name ?? undefined, avatarUrl: avatarUrl ?? undefined },
      context: { disableRevalidate: true },
    });
    return created.id;
  } catch {
    // Concurrent sign-in won the insert — read its row back.
    const retry = await payload.find({
      collection: 'readers',
      where: { email: { equals: email } },
      limit: 1,
      depth: 0,
    });
    return retry.docs[0]?.id ?? null;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      // Always show the Google account chooser. Without this, Google silently
      // reuses the browser's current session, so a reader who wants to switch
      // accounts (or whose first attempt failed) gets an error page instead of
      // a picker.
      authorization: { params: { prompt: 'select_account' } },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, trigger }) {
      if (!token.email) return token;

      // Re-resolve on explicit sign-in so a stale id (row deleted, DB restored)
      // can never stick in a 30-day token and 500 every engagement action.
      const needsResolve = !token.readerId || trigger === 'signIn';
      if (!needsResolve) return token;

      try {
        const id = await resolveReaderId(
          token.email,
          token.name as string | null,
          token.picture as string | null,
          trigger === 'signIn',
        );
        if (id) token.readerId = id;
        else delete token.readerId;
      } catch (e) {
        // DB briefly unavailable: keep the session, drop nothing. getReaderId()
        // returns null, so writes fail closed with "Sign in to…" rather than 500.
        console.error('[auth] could not resolve reader id', e);
      }
      return token;
    },
    session({ session, token }) {
      if (token.readerId) {
        (session as { readerId?: number }).readerId = token.readerId as number;
      }
      return session;
    },
  },
});

/** Session shape used across API routes and pages. */
export type ReaderSession = {
  readerId?: number;
  user?: { name?: string | null; email?: string | null; image?: string | null };
};

/** Convenience: current reader id, or null when signed out / not yet resolved. */
export async function getReaderId(): Promise<number | null> {
  const session = (await auth()) as ReaderSession | null;
  return session?.readerId ?? null;
}
