import { Mail, Sun, Vote, ShieldCheck, BookOpen } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { PageHero } from '@/components/sections/PageHero';
import { MockForm } from '@/components/ui/MockForm';

export const metadata = { title: 'Newsletters' };

const LETTERS = [
  {
    Icon: Sun,
    name: 'The Daily Brief',
    cadence: 'Every morning, 7 AM IST',
    subs: '4.12L subscribers',
    copy: 'Five stories. Twelve minutes. Everything you need to know before your day starts.',
  },
  {
    Icon: Vote,
    name: 'The Election Briefing',
    cadence: 'Weekly · Fridays',
    subs: '92K subscribers',
    copy: 'Numbers, narratives and the swing patterns that aren\'t in the headlines.',
  },
  {
    Icon: ShieldCheck,
    name: 'Fact Check Weekly',
    cadence: 'Weekly · Saturdays',
    subs: '74K subscribers',
    copy: 'The five most-forwarded claims of the week, rated and explained.',
  },
  {
    Icon: BookOpen,
    name: 'The Long Read',
    cadence: 'Sundays',
    subs: '128K subscribers',
    copy: 'One in-depth piece every Sunday. The kind you save and come back to.',
  },
];

export default function NewsletterPage() {
  return (
    <>
      <PageHero
        kicker="Newsletters"
        title="Email that respects your attention"
        description="Pick the briefs you want. Skip the rest. Unsubscribe in one click. No tracking pixels."
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Newsletters' }]}
      />
      <Container as="section" className="py-16">
        <div className="grid gap-5 md:grid-cols-2">
          {LETTERS.map((l) => (
            <div
              key={l.name}
              className="flex gap-5 rounded-2xl border border-line bg-bg p-6"
            >
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-bg-muted text-ink">
                <l.Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-serif text-xl font-semibold text-ink">{l.name}</h3>
                <p className="mt-1 text-xs uppercase tracking-wider text-ink-muted">
                  {l.cadence} · {l.subs}
                </p>
                <p className="mt-3 text-sm text-ink-muted">{l.copy}</p>
                <MockForm
                  className="mt-5 flex items-center gap-2 rounded-full border border-line p-1 pl-4 transition focus-within:border-line-strong"
                >
                  <Mail className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden />
                  <input
                    type="email"
                    aria-label={`Email address for ${l.name}`}
                    placeholder="you@example.com"
                    className="min-w-0 flex-1 bg-transparent py-2 text-sm focus-visible:outline-none"
                  />
                  <button
                    type="submit"
                    className="shrink-0 rounded-full bg-ink px-4 py-2 text-xs font-medium text-bg transition hover:bg-ink/90 active:bg-ink/80 focus-ring"
                  >
                    Subscribe
                  </button>
                </MockForm>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}
