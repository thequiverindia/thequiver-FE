'use client';

import { useState } from 'react';
import { Share2, Link as LinkIcon, Check } from 'lucide-react';
import { XIcon, FacebookIcon, WhatsappIcon } from '@/components/ui/BrandIcons';
import { cn } from '@/lib/utils';

/**
 * Working share actions. `url`/`title` default to the current page so the
 * bar can be dropped into any article/fact-check without wiring.
 */
export function ShareBar({
  className,
  orientation = 'horizontal',
  url,
  title,
}: {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  url?: string;
  title?: string;
}) {
  const [copied, setCopied] = useState(false);

  function pageUrl() {
    return url ?? (typeof window !== 'undefined' ? window.location.href : '');
  }
  function pageTitle() {
    return title ?? (typeof document !== 'undefined' ? document.title : '');
  }
  function openPopup(href: string) {
    window.open(href, '_blank', 'noopener,noreferrer,width=600,height=500');
  }

  const btn =
    'inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-bg text-ink-muted transition hover:border-line-strong hover:bg-bg-muted hover:text-ink active:bg-bg-muted focus-ring';

  return (
    <div
      className={cn(
        'flex gap-1.5',
        orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
        className,
      )}
    >
      <button
        type="button"
        aria-label="Share on WhatsApp"
        title="WhatsApp"
        className={btn}
        onClick={() =>
          openPopup(
            `https://wa.me/?text=${encodeURIComponent(`${pageTitle()} ${pageUrl()}`)}`,
          )
        }
      >
        <WhatsappIcon className="h-4 w-4" />
      </button>
      <button
        type="button"
        aria-label="Share on X"
        title="X (Twitter)"
        className={btn}
        onClick={() =>
          openPopup(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(pageTitle())}&url=${encodeURIComponent(pageUrl())}`,
          )
        }
      >
        <XIcon className="h-4 w-4" />
      </button>
      <button
        type="button"
        aria-label="Share on Facebook"
        title="Facebook"
        className={btn}
        onClick={() =>
          openPopup(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl())}`,
          )
        }
      >
        <FacebookIcon className="h-4 w-4" />
      </button>
      <button
        type="button"
        aria-label={copied ? 'Link copied' : 'Copy link'}
        title="Copy link"
        className={cn(btn, copied && 'border-verified/40 text-verified')}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(pageUrl());
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
          } catch {}
        }}
      >
        {copied ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
      </button>
      <button
        type="button"
        aria-label="Share"
        title="Share"
        className={btn}
        onClick={async () => {
          if (navigator.share) {
            try {
              await navigator.share({ title: pageTitle(), url: pageUrl() });
            } catch {}
          } else {
            try {
              await navigator.clipboard.writeText(pageUrl());
              setCopied(true);
              window.setTimeout(() => setCopied(false), 2000);
            } catch {}
          }
        }}
      >
        <Share2 className="h-4 w-4" />
      </button>
    </div>
  );
}
