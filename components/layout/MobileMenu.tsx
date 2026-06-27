'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import {
  Menu,
  X,
  ChevronRight,
  Landmark,
  Vote,
  MessageSquareQuote,
  BookOpen,
  ShieldCheck,
  Users,
  Video,
  Radio,
  MapPin,
  Globe,
  TrendingUp,
  Mic,
  BarChart3,
} from 'lucide-react';

const DESKTOP_BREAKPOINT = 1024;

type NavItem = { label: string; href: string; icon: typeof Landmark };

const MOBILE_NAV: NavItem[] = [
  { label: 'Politics', href: '/politics', icon: Landmark },
  { label: 'Elections', href: '/elections', icon: Vote },
  { label: 'Opinion', href: '/opinion', icon: MessageSquareQuote },
  { label: 'Explainers', href: '/explainers', icon: BookOpen },
  { label: 'Fact Check', href: '/fact-check', icon: ShieldCheck },
  { label: 'Leaders', href: '/leader', icon: Users },
  { label: 'State News', href: '/state-news', icon: MapPin },
  { label: 'International', href: '/international', icon: Globe },
  { label: 'Trending', href: '/trending', icon: TrendingUp },
  { label: 'Videos', href: '/videos', icon: Video },
  { label: 'Podcasts', href: '/podcasts', icon: Mic },
  { label: 'Live Updates', href: '/live', icon: Radio },
  { label: 'Polls', href: '/polls', icon: BarChart3 },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    function onResize() {
      if (window.innerWidth >= DESKTOP_BREAKPOINT) setOpen(false);
    }

    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  const panel = (
    <div
      className="mobile-menu-panel fixed inset-0 z-[60] flex flex-col bg-bg"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
    >
      {/* Top bar */}
      <div className="flex shrink-0 items-center justify-between border-b border-line px-5 py-4">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="font-serif text-xl font-bold tracking-tight text-ink"
        >
          TheQuiverIndia
        </Link>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-bg-muted text-ink transition hover:bg-line focus-ring"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Section label */}
      <div className="shrink-0 px-5 pb-2 pt-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-subtle">
          Browse
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 pb-6">
        <ul className="flex flex-col gap-1">
          {MOBILE_NAV.map(({ label, href, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setOpen(false)}
                className="group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[15px] font-semibold text-ink transition hover:bg-bg-muted active:bg-bg-muted"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-bg-subtle text-ink-muted transition group-hover:bg-brand/10 group-hover:text-brand">
                  <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
                </span>
                <span className="flex-1">{label}</span>
                <ChevronRight className="h-4 w-4 text-ink-subtle transition group-hover:translate-x-0.5 group-hover:text-ink" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition hover:bg-bg-muted hover:text-ink focus-ring lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {mounted && open && createPortal(panel, document.body)}
    </>
  );
}
