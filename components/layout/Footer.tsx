import Link from 'next/link';
import { Send } from 'lucide-react';
import {
  XIcon,
  InstagramIcon,
  YoutubeIcon,
  FacebookIcon,
  LinkedinIcon,
} from '@/components/ui/BrandIcons';
import { Logo } from './Logo';
import { MockForm } from '@/components/ui/MockForm';
import { FOOTER_LINKS } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-bg-subtle">
      <div className="container-page py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <Logo size="lg" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-muted">
              TheQuiverIndia is an editorial-first political news platform. Verified journalism,
              leader transparency, and citizen voice — built for India.
            </p>
            <MockForm
              className="mt-6 flex max-w-sm items-center gap-2 rounded-full border border-line bg-bg p-1 pl-4 transition focus-within:border-line-strong"
            >
              <input
                type="email"
                placeholder="Your email for the daily brief"
                className="min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-ink-subtle focus-visible:outline-none"
                aria-label="Email address for newsletter"
              />
              <button
                type="submit"
                className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-ink px-4 text-xs font-medium text-bg transition hover:bg-ink/90 active:bg-ink/80 focus-ring"
              >
                <Send className="h-3.5 w-3.5" aria-hidden />
                Subscribe
              </button>
            </MockForm>
            <div className="mt-6 flex items-center gap-2">
              {[
                { Icon: XIcon, label: 'X (Twitter)', href: 'https://twitter.com/thequiverindia' },
                { Icon: InstagramIcon, label: 'Instagram', href: 'https://instagram.com/thequiverindia' },
                { Icon: YoutubeIcon, label: 'YouTube', href: 'https://youtube.com/@thequiverindia' },
                { Icon: FacebookIcon, label: 'Facebook', href: 'https://facebook.com/thequiverindia' },
                { Icon: LinkedinIcon, label: 'LinkedIn', href: 'https://linkedin.com/company/thequiverindia' },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`TheQuiverIndia on ${label}`}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-muted transition hover:border-line-strong hover:bg-bg hover:text-ink active:bg-bg focus-ring"
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:col-span-8">
            {FOOTER_LINKS.map((group) => (
              <div key={group.title}>
                <h3 className="kicker mb-4 text-ink">{group.title}</h3>
                <ul className="space-y-2.5 text-sm">
                  {group.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-ink-muted transition hover:text-ink"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line pb-[env(safe-area-inset-bottom)] pt-6 text-xs text-ink-muted md:mt-16 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} TheQuiverIndia Media Pvt Ltd. All rights reserved.
          </p>
          <p>
            Independent journalism, supported by readers. Read our{' '}
            <Link href="/about#code" className="underline hover:text-ink">
              editorial code
            </Link>{' '}
            and{' '}
            <Link href="/about#fact-check" className="underline hover:text-ink">
              fact-check policy
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
