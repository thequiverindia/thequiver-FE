import { Mail } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { MockForm } from '@/components/ui/MockForm';

export function NewsletterCTA() {
  return (
    <section className="border-y border-line bg-bg-subtle">
      <Container className="py-16">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-bg ring-1 ring-line">
            <Mail className="h-5 w-5 text-ink" />
          </span>
          <h2 className="mt-5 text-balance font-serif text-3xl font-semibold text-ink md:text-4xl">
            The TheQuiverIndia Brief, in your inbox every morning at 7
          </h2>
          <p className="mx-auto mt-3 max-w-md text-pretty text-sm text-ink-muted md:text-base">
            One email. Five stories. Everything you need to know about Indian politics
            before your day starts. 4,12,000+ subscribers and counting.
          </p>
          <MockForm
            className="mx-auto mt-7 flex max-w-md gap-2"
          >
            <input
              type="email"
              placeholder="you@example.com"
              className="flex-1 rounded-full border border-line bg-bg px-4 py-3 text-sm text-ink placeholder:text-ink-subtle focus:border-ink focus:outline-none"
              aria-label="Email address"
            />
            <button
              type="submit"
              className="rounded-full bg-ink px-6 text-sm font-medium text-bg transition hover:bg-ink/90"
            >
              Subscribe
            </button>
          </MockForm>
          <p className="mt-3 text-xs text-ink-subtle">
            Free. Unsubscribe any time. We never share your data.
          </p>
        </div>
      </Container>
    </section>
  );
}
