import Link from 'next/link';
import { Logo } from '@/components/layout/Logo';
export { MockForm as AuthForm } from '@/components/ui/MockForm';

export function AuthShell({
  kicker,
  title,
  description,
  children,
  footer,
}: {
  kicker: string;
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="grid min-h-[calc(100vh-80px)] lg:grid-cols-2">
      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <Logo size="lg" className="mb-10" />
          <p className="kicker">{kicker}</p>
          <h1 className="mt-3 font-serif text-3xl font-semibold text-ink md:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-sm text-ink-muted">{description}</p>
          <div className="mt-8">{children}</div>
          {footer && (
            <p className="mt-6 text-center text-sm text-ink-muted">{footer}</p>
          )}
        </div>
      </div>
      <aside className="hidden bg-ink p-12 text-bg lg:flex lg:items-center">
        <div className="max-w-md">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-saffron">
            Why TheQuiverIndia
          </p>
          <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight md:text-4xl">
            Built for readers who care how the news gets made.
          </h2>
          <ul className="mt-8 space-y-5">
            {[
              {
                title: 'Verified, not viral',
                copy:
                  'Every story shows its sources, its verification status, and the people behind it.',
              },
              {
                title: 'Track every promise',
                copy:
                  'See what your leaders said, what they did, and what they quietly walked back.',
              },
              {
                title: 'No filter bubble',
                copy:
                  'Personalised, but balanced. We never hide the stories that should matter most.',
              },
              {
                title: 'No popups. Ever.',
                copy:
                  'Reader-supported. Ads are clearly labelled. No autoplay video, no dark patterns.',
              },
            ].map((p) => (
              <li key={p.title} className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-saffron" />
                <div>
                  <p className="font-serif text-base font-semibold">{p.title}</p>
                  <p className="mt-1 text-sm text-bg/70">{p.copy}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-xs text-bg/60">
            Already a member?{' '}
            <Link href="/login" className="underline hover:text-bg">
              Sign in
            </Link>{' '}
            or learn more in our{' '}
            <Link href="/about" className="underline hover:text-bg">
              About
            </Link>
            .
          </p>
        </div>
      </aside>
    </div>
  );
}

export function AuthField({
  label,
  type = 'text',
  placeholder,
  hint,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-ink-muted">
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-lg border border-line bg-bg px-4 py-3 text-sm text-ink placeholder:text-ink-subtle focus-ring"
      />
      {hint && <span className="mt-1 block text-xs text-ink-subtle">{hint}</span>}
    </label>
  );
}
