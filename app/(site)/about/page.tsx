import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { PageHero } from '@/components/sections/PageHero';
import { Avatar } from '@/components/ui/Avatar';
import { getArticles, getAuthors, getFactChecks, getLeaders } from '@/lib/data';

export const metadata = {
  title: 'About TheQuiverIndia',
  description: 'How we work, who we are, and what we stand for.',
};

export default async function AboutPage() {
  const [authors, articles, factChecks, leaders] = await Promise.all([
    getAuthors(),
    getArticles({ limit: 500 }),
    getFactChecks({ limit: 500 }),
    getLeaders({}),
  ]);
  const counts = {
    articles: articles.totalDocs,
    factChecks: factChecks.length,
    leaders: leaders.length,
  };
  return (
    <>
      <PageHero
        kicker="About"
        title="Independent political journalism, built for India."
        description="TheQuiverIndia exists to make Indian politics legible. Verified, sourced, plain-spoken — and respectful of your time."
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'About' }]}
      />

      <Container as="section" className="py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="prose-article">
              <h2>Our mission</h2>
              <p>
                Indian political journalism has a credibility problem — and an attention
                problem. Outlets compete on speed, not substance. Headlines outpace
                evidence. Trust is currency that nobody is willing to spend on the slow
                work of getting things right.
              </p>
              <p>
                TheQuiverIndia is a small attempt to do that slow work in public — and to show
                it. Every story we publish carries the evidence we used. Every leader has
                a public profile we update. Every claim we fact-check shows the sources
                we relied on.
              </p>

              <h2 id="code">Editorial code</h2>
              <p>We hold ourselves to four commitments:</p>
              <ol>
                <li>
                  <strong>Sourced or it isn't published.</strong> Every claim has a
                  source. Every source is visible in the byline meta.
                </li>
                <li>
                  <strong>Corrections live forever.</strong> If we get something wrong, we
                  fix it, label it, and keep the correction at the bottom of the page —
                  permanently.
                </li>
                <li>
                  <strong>No anonymous sources without reason.</strong> When we grant
                  anonymity, we explain why in the article.
                </li>
                <li>
                  <strong>No popups, no clickbait, no dark patterns.</strong> Ads are
                  clearly labelled. Sponsored content is disclosed at the top.
                </li>
              </ol>

              <h2 id="fact-check">Fact-check methodology</h2>
              <p>
                We rate claims on a five-level scale: True, Mostly True, Misleading,
                False, and Satire. We do not rate opinions. We rate factual claims that
                can be verified against public evidence.
              </p>
              <p>
                For every claim, we publish: the claim itself, who made it, the evidence
                we examined, the sources we consulted, and the verdict we reached.
              </p>

              <h2>How we are funded</h2>
              <p>
                TheQuiverIndia is funded by reader memberships, a small set of independent
                grants, and clearly-labelled advertising. We publish our funding sources
                on this page, updated quarterly.
              </p>
            </div>
          </div>
          <aside className="lg:col-span-4">
            <div className="sticky top-32 space-y-6">
              <div className="rounded-2xl border border-line bg-bg-subtle p-6">
                <p className="kicker mb-3">By the numbers</p>
                {/* Counted from the database — never hardcoded. A newsroom
                    that invents its own numbers cannot ask readers to trust
                    the ones it reports. */}
                <ul className="space-y-3 text-sm">
                  <Row label="Bylines" value={String(authors.length)} />
                  <Row label="Stories published" value={String(counts.articles)} />
                  <Row label="Fact-checks" value={String(counts.factChecks)} />
                  <Row label="Leaders tracked" value={String(counts.leaders)} />
                  <Row label="Languages" value="English, हिन्दी" />
                </ul>
              </div>
              <div className="rounded-2xl border border-line bg-bg p-6">
                <p className="kicker mb-3">Quick links</p>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/careers" className="text-ink hover:underline">
                      → Careers at TheQuiverIndia
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-ink hover:underline">
                      → Contact a journalist
                    </Link>
                  </li>
                  <li>
                    <Link href="/advertise" className="text-ink hover:underline">
                      → Advertise with us
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="text-ink hover:underline">
                      → Privacy policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </Container>

      <section className="border-t border-line bg-bg-subtle">
        <Container className="py-16">
          <p className="kicker">Newsroom</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-ink md:text-4xl">
            The people behind the bylines
          </h2>
          <p className="mt-3 max-w-2xl text-ink-muted">
            A small team, deliberately. Every name on a TheQuiverIndia byline is a real person
            who answers to corrections, reads your replies, and meets a public standard.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {authors.map((a) => (
              <div
                key={a.id}
                className="rounded-xl border border-line bg-bg p-6 text-center"
              >
                <Avatar src={a.avatar} name={a.name} size="lg" className="mx-auto" />
                <p className="mt-4 font-serif text-lg font-semibold text-ink">
                  {a.name}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wider text-ink-muted">
                  {a.role}
                </p>
                <p className="mt-3 text-sm text-ink-muted">{a.bio}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-center justify-between gap-3 border-b border-line pb-2 last:border-0 last:pb-0">
      <span className="text-ink-muted">{label}</span>
      <span className="font-medium text-ink">{value}</span>
    </li>
  );
}
