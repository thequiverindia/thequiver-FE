'use client';

import { MessageCircle } from 'lucide-react';

/**
 * WhatsApp-first verdict sharing — misinformation travels in family groups,
 * so the rebuttal is formatted to travel the same way.
 */
export function ShareVerdict({ claim, verdict }: { claim: string; verdict: string }) {
  function share() {
    const url = window.location.href;
    const text = [
      '🔍 Fact Check — TheQuiverIndia',
      '',
      `Claim: "${claim}"`,
      `Verdict: ${verdict.toUpperCase()}`,
      '',
      `Full evidence: ${url}`,
    ].join('\n');
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer',
    );
  }

  return (
    <button
      type="button"
      onClick={share}
      className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-bg transition hover:bg-ink/90 active:bg-ink/80 focus-ring"
    >
      <MessageCircle className="h-4 w-4" aria-hidden />
      Share this verdict on WhatsApp
    </button>
  );
}
