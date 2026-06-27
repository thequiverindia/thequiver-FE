import Link from 'next/link';
import { AuthShell, AuthField, AuthForm } from '@/components/auth/AuthShell';

export const metadata = { title: 'Create a TheQuiverIndia account' };

export default function SignupPage() {
  return (
    <AuthShell
      kicker="Join TheQuiverIndia"
      title="Create your free account"
      description="Bookmark stories, follow leaders, vote in polls and get a daily brief that respects your attention."
      footer={
        <>
          Already a member?{' '}
          <Link href="/login" className="font-medium text-ink underline">
            Sign in
          </Link>
        </>
      }
    >
      <AuthForm className="space-y-4">
        <AuthField label="Full name" placeholder="Your name" />
        <AuthField label="Email" type="email" placeholder="you@example.com" />
        <AuthField
          label="Password"
          type="password"
          placeholder="At least 8 characters"
          hint="Use 8+ characters with a mix of letters and numbers."
        />
        <label className="flex items-start gap-2 text-xs text-ink-muted">
          <input type="checkbox" className="mt-0.5 rounded border-line" />
          <span>
            I agree to the{' '}
            <Link href="/terms" className="text-ink underline">
              Terms of Use
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-ink underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        <button
          type="submit"
          className="w-full rounded-full bg-ink py-3 text-sm font-medium text-bg transition hover:bg-ink/90"
        >
          Create account
        </button>
      </AuthForm>
      <p className="mt-4 text-center text-xs text-ink-subtle">
        TheQuiverIndia is free to read. No paywall. Reader-supported journalism.
      </p>
    </AuthShell>
  );
}
