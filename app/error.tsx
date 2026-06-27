'use client';

import Link from 'next/link';
import { AlertOctagon } from 'lucide-react';
import { Container } from '@/components/ui/Container';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container as="section" className="py-20 lg:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-breaking/10 text-breaking">
          <AlertOctagon className="h-6 w-6" />
        </span>
        <p className="mt-6 font-mono text-sm text-ink-muted">
          Error{error.digest && ` · ${error.digest}`}
        </p>
        <h1 className="mt-3 font-serif text-4xl font-semibold text-ink md:text-5xl">
          Something went wrong on our end
        </h1>
        <p className="mt-4 text-lg text-ink-muted">
          We've logged this and we're looking into it. Try refreshing — or head back to
          the homepage.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-bg hover:bg-ink/90"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-full border border-line-strong bg-bg px-5 py-2.5 text-sm font-medium text-ink hover:bg-bg-muted"
          >
            Go to homepage
          </Link>
        </div>
      </div>
    </Container>
  );
}
