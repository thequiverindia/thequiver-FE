import Link from 'next/link';
import { AuthShell, AuthField, AuthForm } from '@/components/auth/AuthShell';

export const metadata = { title: 'Sign in to TheQuiverIndia' };

export default function LoginPage() {
  return (
    <AuthShell
      kicker="Welcome back"
      title="Sign in to TheQuiverIndia"
      description="Pick up where you left off. Your saved articles, followed leaders and reading history sync across devices."
      footer={
        <>
          New here?{' '}
          <Link href="/signup" className="font-medium text-ink underline">
            Create an account
          </Link>
        </>
      }
    >
      <AuthForm className="space-y-4">
        <AuthField label="Email" type="email" placeholder="you@example.com" />
        <AuthField label="Password" type="password" placeholder="••••••••" />
        <div className="flex items-center justify-between text-xs">
          <label className="inline-flex items-center gap-2 text-ink-muted">
            <input type="checkbox" className="rounded border-line" />
            Remember me
          </label>
          <Link href="/forgot" className="font-medium text-ink hover:underline">
            Forgot password?
          </Link>
        </div>
        <button
          type="submit"
          className="w-full rounded-full bg-ink py-3 text-sm font-medium text-bg transition hover:bg-ink/90"
        >
          Sign in
        </button>
      </AuthForm>
      <div className="relative my-6">
        <span className="absolute inset-x-0 top-1/2 h-px bg-line" />
        <span className="relative mx-auto block w-fit bg-bg px-3 text-[10px] uppercase tracking-wider text-ink-muted">
          or continue with
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button className="rounded-full border border-line bg-bg py-2.5 text-sm font-medium text-ink hover:bg-bg-muted">
          Google
        </button>
        <button className="rounded-full border border-line bg-bg py-2.5 text-sm font-medium text-ink hover:bg-bg-muted">
          Apple
        </button>
      </div>
    </AuthShell>
  );
}
