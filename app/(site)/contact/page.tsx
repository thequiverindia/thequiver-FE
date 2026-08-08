import { Mail, Phone, MapPin, AlertCircle, Briefcase, Newspaper } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { PageHero } from '@/components/sections/PageHero';
import { SubmissionForm } from '@/components/engagement/SubmissionForm';

export const metadata = { title: 'Contact TheQuiverIndia' };

const ROUTES = [
  {
    Icon: Newspaper,
    title: 'News tip',
    body: 'Got a tip? We protect sources. Reach our newsroom directly.',
    email: 'tips@thequiverindia.com',
  },
  {
    Icon: AlertCircle,
    title: 'Corrections',
    body: 'Found an error? Tell us. We correct in public and quickly.',
    email: 'corrections@thequiverindia.com',
  },
  {
    Icon: Briefcase,
    title: 'Press & partnerships',
    body: 'Interviews, syndication, partnerships and press queries.',
    email: 'partners@thequiverindia.com',
  },
  {
    Icon: Mail,
    title: 'General enquiries',
    body: 'Subscriptions, account help, accessibility issues.',
    email: 'hello@thequiverindia.com',
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        kicker="Contact"
        title="Talk to us. We read everything."
        description="Tips, corrections, partnerships, complaints — pick the right address below."
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
      />

      <Container as="section" className="py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="grid gap-4 sm:grid-cols-2">
              {ROUTES.map((r) => (
                <div
                  key={r.title}
                  className="rounded-xl border border-line bg-bg p-5"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-bg-muted text-ink">
                    <r.Icon className="h-4 w-4" />
                  </span>
                  <h3 className="mt-4 font-serif text-lg font-semibold text-ink">
                    {r.title}
                  </h3>
                  <p className="mt-1 text-sm text-ink-muted">{r.body}</p>
                  <a
                    href={`mailto:${r.email}`}
                    className="mt-3 inline-flex text-sm font-medium text-ink underline"
                  >
                    {r.email}
                  </a>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-line bg-bg-subtle p-6">
              <h3 className="font-serif text-xl font-semibold text-ink">
                Or send us a message here
              </h3>
              <SubmissionForm
                kind="contact"
                className="mt-4"
                submitLabel="Send message"
                successMessage="Thanks — your message is with our newsroom. We read everything."
                fields={[
                  { name: 'name', label: 'Your name', placeholder: 'Full name' },
                  { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
                  { name: 'subject', label: 'Subject', placeholder: 'What is this about?' },
                  {
                    name: 'message',
                    label: 'Message',
                    type: 'textarea',
                    rows: 5,
                    required: true,
                    placeholder: 'Tell us more…',
                  },
                ]}
              />
            </div>
          </div>

          <aside className="space-y-6 lg:col-span-5">
            <div className="rounded-2xl border border-line bg-bg p-6">
              <p className="kicker mb-4">TheQuiverIndia Newsroom</p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-ink-muted" />
                  <span className="text-ink-muted">
                    TheQuiverIndia Media Pvt Ltd, 2nd Floor, Editorial House, MG Road, Bengaluru
                    560001
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-ink-muted" />
                  <span className="text-ink">+91 80 4123 4567</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-ink-muted" />
                  <a href="mailto:hello@thequiverindia.com" className="text-ink underline">
                    hello@thequiverindia.com
                  </a>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-saffron/30 bg-saffron/5 p-6">
              <p className="kicker mb-2">Tip securely</p>
              <p className="text-sm text-ink-muted">
                For sensitive tips, we accept Signal at the number on this page and
                anonymous submissions via SecureDrop. We do not log IPs on the tip form.
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-ink-muted">
        {label}
      </span>
      {children}
    </label>
  );
}
