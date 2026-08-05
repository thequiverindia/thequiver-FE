import { Bookmark, MessageSquare, Settings, Users } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Avatar } from '@/components/ui/Avatar';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { UserNav } from '@/components/user/UserNav';
import { ArticleCard } from '@/components/cards/ArticleCard';
import { PoliticianCard } from '@/components/cards/PoliticianCard';
import { getArticles, getLeaders } from '@/lib/data';

export const metadata = { title: 'Your profile' };

export default async function ProfilePage() {
  const reading = (await getArticles({ limit: 3 })).docs;
  const followingLeaders = (await getLeaders({})).slice(0, 3);
  return (
    <Container as="section" className="py-10">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Your profile' }]} />

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <div className="rounded-2xl border border-line bg-bg p-6 text-center">
            <Avatar name="Reader" size="xl" className="mx-auto" />
            <h2 className="mt-4 font-serif text-lg font-semibold text-ink">
              Reader
            </h2>
            <p className="text-xs text-ink-muted">Member since June 2025</p>
            <p className="mt-3 text-xs text-ink-muted">
              <strong className="text-ink">412</strong> articles read ·{' '}
              <strong className="text-ink">28</strong> saved
            </p>
          </div>
          <div className="mt-6">
            <UserNav active="/profile" />
          </div>
        </aside>

        <div className="lg:col-span-9">
          <div className="grid gap-4 sm:grid-cols-4">
            <KPI label="Articles read" value="412" Icon={MessageSquare} />
            <KPI label="Saved" value="28" Icon={Bookmark} />
            <KPI label="Following" value="14" Icon={Users} />
            <KPI label="Polls voted" value="63" Icon={Settings} />
          </div>

          <section className="mt-10">
            <h3 className="mb-4 font-serif text-xl font-semibold text-ink">
              Continue reading
            </h3>
            <div className="grid gap-6 md:grid-cols-3">
              {reading.map((a) => (
                <ArticleCard key={a.id} article={a} variant="compact" />
              ))}
            </div>
          </section>

          <section className="mt-12">
            <h3 className="mb-4 font-serif text-xl font-semibold text-ink">
              Leaders you follow
            </h3>
            <div className="grid gap-3">
              {followingLeaders.map((p) => (
                <PoliticianCard key={p.id} politician={p} variant="compact" />
              ))}
            </div>
          </section>
        </div>
      </div>
    </Container>
  );
}

function KPI({
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
      <Icon className="h-4 w-4 text-ink-muted" />
      <p className="mt-3 font-serif text-2xl font-semibold text-ink">{value}</p>
      <p className="text-xs text-ink-muted">{label}</p>
    </div>
  );
}
