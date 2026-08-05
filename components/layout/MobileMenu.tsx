'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import {
  Menu,
  X,
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
  Search,
  UserCircle2,
  Bookmark,
  Bell,
} from 'lucide-react';

const DESKTOP_BREAKPOINT = 1024;
const EXIT_MS = 180;

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

const ACCOUNT_NAV: NavItem[] = [
  { label: 'Search', href: '/search', icon: Search },
  { label: 'Sign in', href: '/login', icon: UserCircle2 },
  { label: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
  { label: 'Notifications', href: '/notifications', icon: Bell },
];

function NavRow({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const { label, href, icon: Icon } = item;
  return (
    <li>
      <Link
        href={href}
        onClick={onNavigate}
        className="group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[15px] font-semibold text-ink transition hover:bg-bg-muted active:bg-bg-muted focus-ring"
      >
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-bg-subtle text-ink-muted transition group-hover:bg-brand/10 group-hover:text-brand">
          <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
        </span>
        <span className="flex-1">{label}</span>
      </Link>
    </li>
  );
}

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  function close() {
    setClosing(true);
    window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
      triggerRef.current?.focus();
    }, EXIT_MS);
  }

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const panel = (
    <div
      className={`${closing ? 'mobile-menu-panel-out' : 'mobile-menu-panel'} fixed inset-x-0 top-0 z-[60] flex h-[100dvh] flex-col bg-bg`}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
    >
      {/* Top bar */}
      <div className="flex shrink-0 items-center justify-between border-b border-line px-5 py-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <Link
          href="/"
          onClick={close}
          className="font-serif text-xl font-bold tracking-tight text-ink focus-ring rounded-md"
        >
          TheQuiverIndia
        </Link>
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label="Close menu"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-bg-muted text-ink transition hover:bg-line active:bg-line focus-ring"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
        <p className="px-3 pb-2 pt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-subtle">
          Browse
        </p>
        <ul className="flex flex-col gap-1">
          {MOBILE_NAV.map((item) => (
            <NavRow key={item.href} item={item} onNavigate={close} />
          ))}
        </ul>
        <p className="px-3 pb-2 pt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-subtle">
          You
        </p>
        <ul className="flex flex-col gap-1">
          {ACCOUNT_NAV.map((item) => (
            <NavRow key={item.href} item={item} onNavigate={close} />
          ))}
        </ul>
      </nav>
    </div>
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-muted transition hover:bg-bg-muted hover:text-ink active:bg-bg-muted focus-ring lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {mounted && open && createPortal(panel, document.body)}
    </>
  );
}
