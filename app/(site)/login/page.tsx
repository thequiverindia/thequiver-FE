import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { auth, signIn } from '@/auth';

export const metadata = { title: 'Sign in' };

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.09 3.57-5.17 3.57-8.81Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.93-2.91l-3.87-3c-1.07.72-2.44 1.14-4.06 1.14-3.12 0-5.77-2.11-6.71-4.95H1.29v3.09A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.29 14.28a7.21 7.21 0 0 1 0-4.56V6.63H1.29a12 12 0 0 0 0 10.74l4-3.09Z" />
      <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.6 4.58 1.79l3.44-3.44A11.98 11.98 0 0 0 1.29 6.63l4 3.09C6.23 6.88 8.88 4.77 12 4.77Z" />
    </svg>
  );
}

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect('/profile');
  const googleConfigured = Boolean(
    process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET,
  );

  return (
    <Container as="section" className="py-20 lg:py-28">
      <div className="mx-auto max-w-md rounded-2xl border border-line bg-bg p-8 text-center">
        <p className="kicker justify-center">TheQuiverIndia</p>
        <h1 className="mt-3 font-serif text-3xl font-semibold text-ink">
          Sign in to TheQuiverIndia
        </h1>
        <p className="mt-3 text-sm text-ink-muted">
          Save stories, vote in reader polls, and join the discussion. One click —
          no passwords, ever.
        </p>

        {googleConfigured ? (
          <form
            action={async () => {
              'use server';
              await signIn('google', { redirectTo: '/' });
            }}
            className="mt-8"
          >
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-line-strong bg-bg px-6 py-3.5 text-sm font-medium text-ink transition hover:bg-bg-muted active:bg-bg-muted focus-ring"
            >
              <GoogleMark className="h-5 w-5" />
              Continue with Google
            </button>
          </form>
        ) : (
          <div className="mt-8 rounded-xl border border-warn/30 bg-warn/5 p-4 text-left text-sm text-ink-muted">
            <p className="font-medium text-ink">Google sign-in isn&rsquo;t configured yet.</p>
            <p className="mt-1">
              The site owner needs to add <code>AUTH_GOOGLE_ID</code> and{' '}
              <code>AUTH_GOOGLE_SECRET</code> to the environment (see SETUP.md).
            </p>
          </div>
        )}

        <p className="mt-6 text-xs text-ink-subtle">
          By continuing you agree to our{' '}
          <Link href="/terms" className="underline hover:text-ink">
            Terms
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline hover:text-ink">
            Privacy Policy
          </Link>
          . We only receive your name, email and photo — nothing else.
        </p>
      </div>
    </Container>
  );
}
