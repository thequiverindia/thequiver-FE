import { Container } from '@/components/ui/Container';
import { PageHero } from '@/components/sections/PageHero';

export const metadata = { title: 'Privacy policy' };

const SECTIONS = [
  {
    h: 'What we collect',
    p: 'We collect the minimum necessary: your name, email and photo from Google when you sign in, the stories you save, the comments you post, and the polls you vote in. We do not build a reading profile and we do not sell your data. Ever.',
  },
  {
    h: 'Cookies',
    p: 'We use one strictly-necessary session cookie. We use one anonymous analytics cookie that you can refuse without losing any feature. We do not use ad-tech tracking cookies.',
  },
  {
    h: 'Third-party services',
    p: 'We do not send any email yet, and we take no payments. Sign-in is handled by Google; the site is hosted on Vercel with the database on Neon and images on Cloudflare R2. If that changes, we will update this page before it does.',
  },
  {
    h: 'Your rights',
    p: 'You can request a copy of your data, ask us to delete it, or correct it — at any time. We respond within 30 days, usually faster.',
  },
  {
    h: 'Children',
    p: 'TheQuiverIndia is intended for readers aged 18 and above. We do not knowingly collect information from children under 13.',
  },
  {
    h: 'Government requests',
    p: 'We publish a biannual transparency report listing every government request we receive — even when we are legally restricted from describing the content of a particular request.',
  },
  {
    h: 'Changes',
    p: 'When this policy changes, we email everyone with an account at least 30 days before the changes take effect.',
  },
  {
    h: 'Contact',
    p: 'For any privacy question: contact@thequiverindia.com. Our Data Protection Officer can be reached at dpo@thequiverindia.com.',
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        kicker="Legal"
        title="Privacy policy"
        description="Last updated 14 June 2026. We try to write this like a person would, not a lawyer."
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Privacy' }]}
      />
      <Container as="article" className="py-16">
        <div className="mx-auto max-w-3xl prose-article">
          <p className="lead text-xl text-ink-muted">
            Short version: we collect very little, we never sell it, and you can ask us to
            delete it at any time. The long version follows.
          </p>
          {SECTIONS.map((s, i) => (
            <section key={s.h} className="mt-10">
              <h2>
                <span className="mr-3 font-mono text-base text-ink-subtle">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {s.h}
              </h2>
              <p>{s.p}</p>
            </section>
          ))}
        </div>
      </Container>
    </>
  );
}
