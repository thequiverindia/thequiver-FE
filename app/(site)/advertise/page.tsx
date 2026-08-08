import { Container } from '@/components/ui/Container';
import { PageHero } from '@/components/sections/PageHero';
import { SubmissionForm } from '@/components/engagement/SubmissionForm';

export const metadata = { title: 'Advertise on TheQuiverIndia' };

const FORMATS = [
  {
    title: 'In-feed display',
    copy: 'Premium placement in our editorial feed. Always labelled "Advertisement".',
    starts: '₹2.5L / week',
  },
  {
    title: 'Newsletter sponsorship',
    copy: 'One sponsor per edition, clearly disclosed. Launching soon.',
    starts: 'On request',
  },
  {
    title: 'Custom content',
    copy: 'Branded content produced by our editorial-services team. Fully disclosed.',
    starts: 'On request',
  },
];

export default function AdvertisePage() {
  return (
    <>
      <PageHero
        kicker="Advertise"
        title="Reach India's most engaged political readers"
        description="Premium, brand-safe placement across web, newsletter and podcast — with clear disclosure and no dark patterns."
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Advertise' }]}
      />

      <Container as="section" className="py-16">
        {/* We publish audience figures only once they are independently
            measurable. Inventing them would undercut the entire proposition. */}
        <div className="rounded-2xl border border-line bg-bg-subtle p-6">
          <p className="text-sm text-ink-muted">
            We&rsquo;re a young newsroom and we don&rsquo;t publish audience numbers we
            can&rsquo;t verify. Ask us for current, analytics-backed figures and
            we&rsquo;ll send them with the media kit — no rounded-up claims.
          </p>
        </div>

        <h2 className="mt-16 font-serif text-2xl font-semibold text-ink md:text-3xl">
          Ad formats
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {FORMATS.map((f) => (
            <div key={f.title} className="rounded-xl border border-line bg-bg p-6">
              <h3 className="font-serif text-lg font-semibold text-ink">{f.title}</h3>
              <p className="mt-2 text-sm text-ink-muted">{f.copy}</p>
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-saffron">
                From {f.starts}
              </p>
            </div>
          ))}
        </div>

        <section className="mt-16 rounded-2xl border border-line bg-bg-subtle p-8">
          <p className="kicker">Standards</p>
          <h3 className="mt-3 font-serif text-2xl font-semibold text-ink">
            What we will not run
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-ink-muted">
            <li>· Political advocacy from anonymous funders</li>
            <li>· Ads that imply editorial endorsement</li>
            <li>· Autoplay video or popups</li>
            <li>· Sensationalist headlines designed to look like our journalism</li>
            <li>· Categories restricted under ASCI guidelines</li>
          </ul>
        </section>

        <section className="mt-16 grid gap-6 rounded-2xl border border-line bg-bg p-8 md:grid-cols-2">
          <div>
            <p className="kicker mb-3">Get in touch</p>
            <h3 className="font-serif text-2xl font-semibold text-ink">
              Talk to our partnerships team
            </h3>
            <p className="mt-3 text-sm text-ink-muted">
              Send a brief or request a media kit. We respond within one working day.
            </p>
            <a
              href="mailto:contact@thequiverindia.com"
              className="mt-5 inline-flex rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-bg hover:bg-ink/90"
            >
              contact@thequiverindia.com
            </a>
          </div>
          <SubmissionForm
            kind="advertising"
            submitLabel="Request media kit"
            successMessage="Thanks — our partnerships desk will be in touch."
            fields={[
              { name: 'name', label: 'Your name', placeholder: 'Full name' },
              { name: 'email', label: 'Work email', type: 'email', placeholder: 'you@company.com' },
              {
                name: 'message',
                label: 'What are you looking for?',
                type: 'textarea',
                rows: 4,
                required: true,
                placeholder: 'Campaign goals, timing, budget range…',
              },
            ]}
          />
        </section>
      </Container>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-bg p-5">
      <p className="text-[10px] uppercase tracking-wider text-ink-muted">{label}</p>
      <p className="mt-2 font-serif text-3xl font-semibold text-ink md:text-4xl">
        {value}
      </p>
    </div>
  );
}
