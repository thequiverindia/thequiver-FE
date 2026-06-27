import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Twitter,
  Instagram,
  Facebook,
  Globe,
  Star,
  Users,
  MapPin,
  GraduationCap,
  Briefcase,
  Wallet,
  Gavel,
  CalendarCheck,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Avatar } from '@/components/ui/Avatar';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { PromiseTracker } from '@/components/politician/PromiseTracker';
import { Timeline } from '@/components/politician/Timeline';
import { PoliticianCard } from '@/components/cards/PoliticianCard';
import { ArticleCard } from '@/components/cards/ArticleCard';
import { POLITICIANS, ARTICLES, findPolitician } from '@/lib/mock-data';
import { formatNumber } from '@/lib/utils';

export async function generateStaticParams() {
  return POLITICIANS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const p = findPolitician(params.slug);
  if (!p) return { title: 'Leader not found' };
  return {
    title: `${p.name} — ${p.position}`,
    description: p.bio,
  };
}

export default function LeaderPage({ params }: { params: { slug: string } }) {
  const p = findPolitician(params.slug);
  if (!p) notFound();
  const others = POLITICIANS.filter((x) => x.id !== p.id).slice(0, 4);
  const mentions = ARTICLES.slice(0, 4);

  return (
    <>
      <div className="h-2 w-full" style={{ background: p.partyColor }} aria-hidden />

      <header className="border-b border-line bg-bg-subtle">
        <Container className="py-8 md:py-10">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Leaders', href: '/leader' },
              { label: p.name, truncate: true },
            ]}
          />
          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <Avatar
                src={p.image}
                name={p.name}
                size="xl"
                className="h-24 w-24 md:h-28 md:w-28"
              />
              <div className="min-w-0">
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.16em]"
                  style={{ color: p.partyColor }}
                >
                  {p.party} ({p.partyShort})
                </p>
                <h1 className="mt-1 text-balance font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl md:text-5xl">
                  {p.name}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5" />
                    {p.position}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {p.constituency}, {p.state}
                  </span>
                  <span>Age {p.age}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-bg hover:bg-ink/90 sm:flex-initial">
                <Users className="h-3.5 w-3.5" />
                Follow
              </button>
              <button className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full border border-line-strong bg-bg px-5 text-sm font-medium text-ink hover:bg-bg-muted sm:flex-initial">
                <Star className="h-3.5 w-3.5" />
                Rate
              </button>
              <div className="flex items-center gap-1">
                {p.socials.twitter && (
                  <SocialButton
                    href={`https://twitter.com/${p.socials.twitter}`}
                    Icon={Twitter}
                  />
                )}
                {p.socials.instagram && (
                  <SocialButton
                    href={`https://instagram.com/${p.socials.instagram}`}
                    Icon={Instagram}
                  />
                )}
                {p.socials.facebook && (
                  <SocialButton
                    href={`https://facebook.com/${p.socials.facebook}`}
                    Icon={Facebook}
                  />
                )}
                {p.socials.web && (
                  <SocialButton href={`https://${p.socials.web}`} Icon={Globe} />
                )}
              </div>
            </div>
          </div>

          <p className="mt-6 max-w-3xl text-pretty text-base leading-relaxed text-ink-muted md:mt-8 md:text-lg">
            {p.bio}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:mt-8 md:grid-cols-6">
            <Stat label="Rating" value={`${p.rating}/10`} Icon={Star} />
            <Stat label="Followers" value={formatNumber(p.followers)} Icon={Users} />
            <Stat
              label="Attendance"
              value={p.attendance !== undefined ? `${p.attendance}%` : '—'}
              Icon={CalendarCheck}
            />
            <Stat
              label="Questions"
              value={p.questionsAsked?.toString() ?? '—'}
              Icon={Briefcase}
            />
            <Stat
              label="Net worth"
              value={p.net_worth ?? '—'}
              Icon={Wallet}
            />
            <Stat
              label="Criminal cases"
              value={p.criminalCases?.toString() ?? '0'}
              Icon={Gavel}
            />
          </div>
        </Container>
      </header>

      {/* Promise Tracker */}
      <Container as="section" className="py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="kicker">Promise tracker</p>
                <h2 className="mt-2 font-serif text-2xl font-semibold text-ink md:text-3xl">
                  Every promise made, tracked
                </h2>
              </div>
              <Badge tone="verified">Updated weekly</Badge>
            </div>
            <PromiseTracker promises={p.promises} />
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-32 space-y-6">
              <div className="rounded-xl border border-line bg-bg p-5">
                <p className="kicker mb-3">Profile</p>
                <dl className="space-y-3 text-sm">
                  {p.education && (
                    <Row Icon={GraduationCap} label="Education" value={p.education} />
                  )}
                  <Row Icon={MapPin} label="Constituency" value={p.constituency} />
                  <Row Icon={Briefcase} label="Role" value={p.position} />
                </dl>
              </div>

              <div className="rounded-xl border border-line bg-bg-subtle p-5">
                <p className="kicker mb-3">Did you know?</p>
                <p className="font-serif text-base leading-snug text-ink">
                  TheQuiverIndia updates promise statuses every Friday, sourced from official
                  records, press releases and our reporting team.
                </p>
                <Link
                  href="/about#fact-check"
                  className="mt-3 inline-flex text-xs font-medium text-ink hover:underline"
                >
                  How we verify →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </Container>

      {/* Timeline */}
      <section className="border-y border-line bg-bg-subtle">
        <Container className="py-16">
          <div className="mb-8">
            <p className="kicker">Career timeline</p>
            <h2 className="mt-2 font-serif text-2xl font-semibold text-ink md:text-3xl">
              Milestones, elections, controversies
            </h2>
          </div>
          <div className="max-w-3xl">
            <Timeline events={p.timeline} />
          </div>
        </Container>
      </section>

      {/* Mentions */}
      <Container as="section" className="py-16">
        <div className="mb-8">
          <p className="kicker">In the news</p>
          <h2 className="mt-2 font-serif text-2xl font-semibold text-ink md:text-3xl">
            Recent coverage mentioning {p.name.split(' ')[0]}
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {mentions.map((a) => (
            <ArticleCard key={a.id} article={a} variant="compact" />
          ))}
        </div>
      </Container>

      {/* Other leaders */}
      <section className="border-t border-line bg-bg-subtle">
        <Container className="py-16">
          <h2 className="mb-8 font-serif text-2xl font-semibold text-ink md:text-3xl">
            Compare with other leaders
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((o) => (
              <PoliticianCard key={o.id} politician={o} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

function SocialButton({
  href,
  Icon,
}: {
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-bg text-ink-muted transition hover:border-line-strong hover:text-ink"
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}

function Stat({
  label,
  value,
  Icon,
}: {
  label: string;
  value: string;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-xl border border-line bg-bg p-4">
      <p className="text-[10px] uppercase tracking-wider text-ink-muted">
        <Icon className="mr-1 inline-block h-3 w-3" />
        {label}
      </p>
      <p className="mt-1 font-serif text-xl font-semibold text-ink md:text-2xl">
        {value}
      </p>
    </div>
  );
}

function Row({
  Icon,
  label,
  value,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 text-ink-muted" />
      <div>
        <dt className="text-[10px] uppercase tracking-wider text-ink-muted">
          {label}
        </dt>
        <dd className="mt-0.5 text-sm text-ink">{value}</dd>
      </div>
    </div>
  );
}
