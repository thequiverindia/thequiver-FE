import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { UserNav } from '@/components/user/UserNav';

export const metadata = { title: 'Settings' };

const SECTIONS = [
  {
    title: 'Account',
    rows: [
      { label: 'Name', value: 'Reader', editable: true },
      { label: 'Email', value: 'reader@example.com', editable: true },
      { label: 'Password', value: 'Last changed 3 months ago', editable: true },
    ],
  },
  {
    title: 'Reading preferences',
    rows: [
      { label: 'Default font size', value: 'Medium', editable: true },
      { label: 'Default theme', value: 'System', editable: true },
      { label: 'Language', value: 'English', editable: true },
    ],
  },
  {
    title: 'Email & notifications',
    rows: [
      { label: 'Daily Brief', value: 'On — 7 AM IST', editable: true, toggle: true },
      { label: 'Breaking news alerts', value: 'On', editable: true, toggle: true },
      { label: 'Fact-check digest (weekly)', value: 'On', editable: true, toggle: true },
      { label: 'Election updates', value: 'Off', editable: true, toggle: true },
    ],
  },
  {
    title: 'Privacy',
    rows: [
      { label: 'Show my comments publicly', value: 'On', toggle: true },
      { label: 'Allow TheQuiverIndia to improve recommendations', value: 'On', toggle: true },
      { label: 'Download my data', value: 'Request export', editable: true },
    ],
  },
];

export default function SettingsPage() {
  return (
    <Container as="section" className="py-10">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Settings' }]} />

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <UserNav active="/settings" />
        </aside>

        <div className="space-y-8 lg:col-span-9">
          <h1 className="font-serif text-3xl font-semibold text-ink">Settings</h1>

          {SECTIONS.map((sec) => (
            <section
              key={sec.title}
              className="overflow-hidden rounded-2xl border border-line bg-bg"
            >
              <div className="border-b border-line px-6 py-4">
                <p className="kicker">{sec.title}</p>
              </div>
              <ul className="divide-y divide-line">
                {sec.rows.map((r) => (
                  <li
                    key={r.label}
                    className="flex items-center justify-between gap-4 px-6 py-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink">{r.label}</p>
                      <p className="mt-0.5 text-xs text-ink-muted">{r.value}</p>
                    </div>
                    {r.toggle ? (
                      <Toggle on={r.value !== 'Off'} />
                    ) : (
                      r.editable && (
                        <button className="text-xs font-medium text-ink underline">
                          Edit
                        </button>
                      )
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <section className="rounded-2xl border border-breaking/30 bg-breaking/5 p-6">
            <p className="kicker mb-2 !text-breaking">Danger zone</p>
            <p className="font-serif text-lg text-ink">Delete your account</p>
            <p className="mt-1 text-sm text-ink-muted">
              This will permanently remove your account, your bookmarks, your comments and
              your poll history.
            </p>
            <button className="mt-4 inline-flex rounded-full border border-breaking/30 px-4 py-2 text-sm font-medium text-breaking hover:bg-breaking/10">
              Delete account
            </button>
          </section>
        </div>
      </div>
    </Container>
  );
}

function Toggle({ on = false, label }: { on?: boolean; label?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label ?? 'Toggle setting'}
      className={`inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition focus-ring ${
        on ? 'bg-verified' : 'bg-bg-muted'
      }`}
    >
      <span
        aria-hidden
        className={`h-5 w-5 rounded-full bg-bg shadow transition ${on ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  );
}
