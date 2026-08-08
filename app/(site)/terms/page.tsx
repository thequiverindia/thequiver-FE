import { Container } from '@/components/ui/Container';
import { PageHero } from '@/components/sections/PageHero';

export const metadata = { title: 'Terms of use' };

const SECTIONS = [
  {
    h: 'Using TheQuiverIndia',
    p: 'You may read, share and link to anything we publish, freely. You may not republish full articles without permission. You may quote up to 200 words with attribution and a link back to the original.',
  },
  {
    h: 'Accounts',
    p: 'You\'re responsible for what happens on your account. Don\'t share your password. If you suspect account compromise, write to us at contact@thequiverindia.com immediately.',
  },
  {
    h: 'Comments',
    p: 'Comments are moderated. We remove harassment, threats, slurs and spam. Disagreement is welcome — name-calling isn\'t. Repeated violations end in a permanent ban.',
  },
  {
    h: 'Submissions',
    p: 'When you submit a tip or a fact-check claim, you grant us a non-exclusive licence to use it for journalism. We protect sources by default.',
  },
  {
    h: 'Liability',
    p: 'We work hard to publish accurate journalism, but we are not liable for actions taken on the basis of our reporting. If you rely on a story for a critical decision, verify it independently.',
  },
  {
    h: 'Governing law',
    p: 'These terms are governed by the laws of India. Disputes are subject to the jurisdiction of the courts at Bengaluru.',
  },
  {
    h: 'Changes',
    p: 'When these terms change, we will email everyone with an account at least 30 days before the changes take effect.',
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero
        kicker="Legal"
        title="Terms of use"
        description="The ground rules for using TheQuiverIndia. Written so a reader, not a lawyer, can understand them."
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Terms' }]}
      />
      <Container as="article" className="py-16">
        <div className="mx-auto max-w-3xl prose-article">
          <p className="lead text-xl text-ink-muted">
            Last updated 14 June 2026. If anything below conflicts with another agreement
            we have with you, the more specific one wins.
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
