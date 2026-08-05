import type { Metadata, Viewport } from 'next';
import {
  Inter,
  Lora,
  Noto_Sans_Devanagari,
  Noto_Serif_Devanagari,
} from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ThemeScript } from '@/components/layout/ThemeScript';
import { SITE_URL } from '@/lib/site';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

// Devanagari fonts so Hindi content renders first-class, not in fallbacks.
// Latin glyphs come from Inter/Lora; Devanagari falls through to Noto.
const notoSansHi = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans-hi',
  display: 'swap',
});

const notoSerifHi = Noto_Serif_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif-hi',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [{ url: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  alternates: {
    types: { 'application/rss+xml': `${SITE_URL}/feed.xml` },
  },
  title: {
    default: 'TheQuiverIndia — Politics. Power. People.',
    template: '%s · TheQuiverIndia',
  },
  description:
    'India\'s editorial-first political news platform. Verified journalism, leader transparency, real-time election intelligence and citizen voice.',
  keywords: [
    'India politics',
    'election news',
    'fact check',
    'politician profiles',
    'opinion',
    'explainers',
  ],
  openGraph: {
    type: 'website',
    siteName: 'TheQuiverIndia',
    title: 'TheQuiverIndia — Politics. Power. People.',
    description: 'India\'s editorial-first political news platform.',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@thequiverindia',
  },
};

// theme-color is set at runtime by ThemeScript / lib/theme.ts so it always
// matches the user's chosen theme + mode, not just the OS preference.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${lora.variable} ${notoSansHi.variable} ${notoSerifHi.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
        {/* Privacy-first analytics — active only when Umami env vars are set */}
        {process.env.NEXT_PUBLIC_UMAMI_SRC && process.env.NEXT_PUBLIC_UMAMI_ID && (
          <script
            defer
            src={process.env.NEXT_PUBLIC_UMAMI_SRC}
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_ID}
          />
        )}
      </head>
      <body className="min-h-screen bg-bg text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main" tabIndex={-1} className="min-h-[60vh] outline-none">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
