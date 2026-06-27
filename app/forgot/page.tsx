import Link from 'next/link';
import { AuthShell, AuthField, AuthForm } from '@/components/auth/AuthShell';

export const metadata = { title: 'Reset your password' };

export default function ForgotPage() {
  return (
    <AuthShell
      kicker="Forgot password"
      title="Reset your password"
      description="Enter your email and we'll send you a link to set a new one. Links expire in 30 minutes."
      footer={
        <>
          Remembered it?{' '}
          <Link href="/login" className="font-medium text-ink underline">
            Sign in
          </Link>
        </>
      }
    >
      <AuthForm className="space-y-4">
        <AuthField label="Email" type="email" placeholder="you@example.com" />
        <button
          type="submit"
          className="w-full rounded-full bg-ink py-3 text-sm font-medium text-bg hover:bg-ink/90"
        >
          Send reset link
        </button>
      </AuthForm>
    </AuthShell>
  );
}
