import type { Metadata, Viewport } from 'next';
import { Inter, Lora } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ThemeScript } from '@/components/layout/ThemeScript';
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

export const metadata: Metadata = {
  metadataBase: new URL('https://thequiverindia.in'),
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
    <html lang="en" className={`${inter.variable} ${lora.variable}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
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
