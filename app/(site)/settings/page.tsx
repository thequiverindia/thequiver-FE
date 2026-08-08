import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Palette, Mail, ShieldCheck } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { UserNav } from '@/components/user/UserNav';
import { auth, signOut, type ReaderSession } from '@/auth';

export const metadata = { title: 'Settings' };

/**
 * Real account settings.
 *
 * This page used to render a hardcoded "Reader / reader@example.com /
 * Password: last changed 3 months ago" to EVERY visitor, signed in or not —
 * on a site that has no passwords at all. It now shows the actual signed-in
 * account and only claims what the platform genuinely does.
 */
export default async function SettingsPage() {
  const session = (await auth()) as ReaderSession | null;
  if (!session?.user) redirect('/login');

  return (
    <Container as="section" className="py-10">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Settings' }]} />

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <UserNav active="/settings" />
        </aside>

        <div className="space-y-6 lg:col-span-9">
          <h1 className="font-serif text-3xl font-semibold text-ink">Settings</h1>

          {/* Account — real values from the session */}
          <section className="rounded-2xl border border-line bg-bg p-6">
            <p className="kicker mb-4">Account</p>
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4 border-b border-line pb-3">
                <dt className="text-ink-muted">Name</dt>
                <dd className="font-medium text-ink">{session.user.name ?? '—'}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-line pb-3">
                <dt className="text-ink-muted">Email</dt>
                <dd className="font-medium text-ink">{session.user.email ?? '—'}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-ink-muted">Sign-in method</dt>
                <dd className="font-medium text-ink">Google</dd>
              </div>
            </dl>
            <p className="mt-4 text-xs text-ink-subtle">
              Your name, email and photo come from your Google account — change them
              there and they update here. We never see or store a password.
            </p>
          </section>

          {/* Appearance — genuinely available, in the header */}
          <section className="rounded-2xl border border-line bg-bg p-6">
            <p className="kicker mb-3">Appearance</p>
            <p className="flex items-start gap-3 text-sm text-ink-muted">
              <Palette className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              Theme and light/dark mode are set from the palette icon in the header.
              Your choice is remembered on this device.
            </p>
          </section>

          {/* Email — honest about what doesn't exist yet */}
          <section className="rounded-2xl border border-line bg-bg p-6">
            <p className="kicker mb-3">Email</p>
            <p className="flex items-start gap-3 text-sm text-ink-muted">
              <Mail className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              We don&rsquo;t send any email yet. You can{' '}
              <Link href="/newsletter" className="font-medium text-ink underline">
                join the newsletter waitlist
              </Link>{' '}
              and we&rsquo;ll write only once the daily brief launches.
            </p>
          </section>

          {/* Privacy */}
          <section className="rounded-2xl border border-line bg-bg p-6">
            <p className="kicker mb-3">Your data</p>
            <p className="flex items-start gap-3 text-sm text-ink-muted">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              We store your name, email and photo from Google, plus the stories you
              save, the comments you post and the polls you vote in. Read the{' '}
              <Link href="/privacy" className="font-medium text-ink underline">
                privacy policy
              </Link>
              . To delete your account and everything attached to it, email us from{' '}
              <Link href="/contact" className="font-medium text-ink underline">
                the contact page
              </Link>{' '}
              and we&rsquo;ll action it.
            </p>
          </section>

          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/' });
            }}
          >
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-bg px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-bg-muted active:bg-bg-muted focus-ring"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden />
              Sign out
            </button>
          </form>
        </div>
      </div>
    </Container>
  );
}
