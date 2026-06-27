import Link from 'next/link';
import { MapPin, Clock, Briefcase, ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { PageHero } from '@/components/sections/PageHero';

export const metadata = { title: 'Careers at TheQuiverIndia' };

const ROLES = [
  {
    title: 'Senior Correspondent — Parliament',
    type: 'Full-time',
    location: 'New Delhi',
    team: 'Editorial',
    description:
      'Cover the legislative process, party leadership, and the inside-out of how laws get made.',
  },
  {
    title: 'Data Journalist',
    type: 'Full-time',
    location: 'Bengaluru',
    team: 'Editorial',
    description:
      'Build datasets, design visualisations, and find the story inside the spreadsheet.',
  },
  {
    title: 'Fact-check Editor',
    type: 'Full-time',
    location: 'Remote (India)',
    team: 'Verification',
    description:
      'Lead our fact-check desk. Set methodology, train reporters, publish two pieces a week.',
  },
  {
    title: 'Product Engineer',
    type: 'Full-time',
    location: 'Bengaluru / Remote',
    team: 'Product',
    description:
      'Build the reading experience millions of Indians will rely on. TypeScript, Next.js, Postgres.',
  },
  {
    title: 'Video Producer',
    type: 'Full-time',
    location: 'Mumbai',
    team: 'Video',
    description:
      'Lead production for our daily 12-minute brief and weekly explainer series.',
  },
  {
    title: 'Community Editor',
    type: 'Contract',
    location: 'Remote',
    team: 'Editorial',
    description:
      'Moderate, surface and respond to the best of our reader community.',
  },
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        kicker="Careers"
        title="Build the most trusted political newsroom in India"
        description="We hire for craft, curiosity and a refusal to settle. Open roles across editorial, product, video and verification."
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Careers' }]}
      />

      <Container as="section" className="py-16">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="font-serif text-2xl font-semibold text-ink md:text-3xl">
              Open roles
            </h2>
            <ul className="mt-6 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-bg">
              {ROLES.map((r) => (
                <li key={r.title}>
                  <Link
                    href="#"
                    className="group flex items-start gap-6 p-6 transition hover:bg-bg-subtle"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-saffron">
                        {r.team}
                      </p>
                      <h3 className="mt-1 font-serif text-lg font-semibold text-ink group-hover:text-brand">
                        {r.title}
                      </h3>
                      <p className="mt-2 text-sm text-ink-muted">{r.description}</p>
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {r.location}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {r.type}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          {r.team}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0 text-ink-muted transition group-hover:translate-x-1 group-hover:text-ink" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <aside className="lg:col-span-5">
            <div className="sticky top-32 space-y-6">
              <div className="rounded-2xl border border-line bg-bg-subtle p-6">
                <p className="kicker mb-3">Why work here</p>
                <ul className="space-y-3 text-sm text-ink-muted">
                  <li>· Editorial independence, written into our governance.</li>
                  <li>· Salaries published openly within bands.</li>
                  <li>· 4-day work week, year-round.</li>
                  <li>· No mandatory in-office days.</li>
                  <li>· Conference and book budgets.</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-line bg-bg p-6">
                <p className="kicker mb-3">Don't see your role?</p>
                <p className="text-sm text-ink-muted">
                  We hire ahead. Send your portfolio and the role you'd want to build.
                </p>
                <a
                  href="mailto:hiring@thequiverindia.in"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink underline"
                >
                  hiring@thequiverindia.in →
                </a>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
