import { Container } from '@/components/ui/Container';
import { PageHero } from '@/components/sections/PageHero';
import { MockForm } from '@/components/ui/MockForm';

export const metadata = { title: 'Advertise on TheQuiverIndia' };

const FORMATS = [
  {
    title: 'In-feed display',
    copy: 'Premium placement in our editorial feed. Always labelled "Advertisement".',
    starts: '₹2.5L / week',
  },
  {
    title: 'Newsletter sponsorship',
    copy: 'One sponsor per edition. 4,12,000 daily subscribers, 38% open rate.',
    starts: '₹1.8L / send',
  },
  {
    title: 'Podcast pre-roll',
    copy: 'Read by host. Limited to two slots per episode. 2.4L weekly downloads.',
    starts: '₹95K / episode',
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Monthly readers" value="14.2M" />
          <Stat label="Newsletter subscribers" value="4.12L" />
          <Stat label="Podcast downloads/wk" value="2.4L" />
          <Stat label="Average session" value="6m 12s" />
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
              href="mailto:partners@thequiverindia.in"
              className="mt-5 inline-flex rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-bg hover:bg-ink/90"
            >
              partners@thequiverindia.in
            </a>
          </div>
          <MockForm className="space-y-3">
            <input
              placeholder="Company"
              className="w-full rounded-lg border border-line bg-bg p-3 text-sm focus-ring"
            />
            <input
              placeholder="Email"
              type="email"
              className="w-full rounded-lg border border-line bg-bg p-3 text-sm focus-ring"
            />
            <textarea
              rows={3}
              placeholder="Tell us about your brief"
              className="w-full rounded-lg border border-line bg-bg p-3 text-sm focus-ring"
            />
            <button className="rounded-full border border-line bg-bg-muted px-4 py-2.5 text-sm font-medium text-ink hover:bg-line">
              Request media kit
            </button>
          </MockForm>
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
