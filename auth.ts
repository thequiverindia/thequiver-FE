import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { getPayload } from 'payload';
import config from '@payload-config';

/**
 * Reader authentication — Google only (no passwords, no emails to send).
 * Sessions are JWTs (no session table needed). On first sign-in a row is
 * created in the Readers collection; its id rides along in the token so
 * API routes can attach comments/votes/bookmarks to it.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, trigger }) {
      // Resolve (or create) the reader row once, then cache its id in the token.
      if (!token.readerId && token.email) {
        try {
          const payload = await getPayload({ config });
          const existing = await payload.find({
            collection: 'readers',
            where: { email: { equals: token.email } },
            limit: 1,
            depth: 0,
          });
          if (existing.docs[0]) {
            token.readerId = existing.docs[0].id;
            // Keep name/avatar fresh on explicit sign-in.
            if (trigger === 'signIn') {
              await payload.update({
                collection: 'readers',
                id: existing.docs[0].id,
                data: {
                  name: (token.name as string) ?? undefined,
                  avatarUrl: (token.picture as string) ?? undefined,
                },
                context: { disableRevalidate: true },
              });
            }
          } else {
            const created = await payload.create({
              collection: 'readers',
              data: {
                email: token.email,
                name: (token.name as string) ?? undefined,
                avatarUrl: (token.picture as string) ?? undefined,
              },
              context: { disableRevalidate: true },
            });
            token.readerId = created.id;
          }
        } catch {
          // DB briefly unavailable — token stays valid, readerId resolves next time.
        }
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
