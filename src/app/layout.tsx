import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { cookies } from 'next/headers';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { I18nProvider } from '@/lib/i18n';
import { LOCALE_COOKIE, normalizeLocale } from '@/lib/locale';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UrlToaster from '@/components/UrlToaster';
import { Suspense } from 'react';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const jetbrains = JetBrains_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://eve-ded-tracker.vercel.app'),
  title: 'DED Tracker — EVE Online Loot Tracker',
  description: 'Log your EVE Online DED escalation profitability. Track factions, evaluate your loot instantly via Janice, and maximize your ISK.',
  keywords: ['EVE Online', 'DED Tracker', 'Loot Appraiser', 'ISK', 'Janice', 'EVE DED', 'Abyssal'],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'DED Tracker — EVE Online',
    description: 'Track your EVE Online DED escalation profitability, appraise your loot, and check your PNL!',
    type: 'website',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DED Tracker',
    description: 'Track your EVE Online DED escalation profitability and evaluate your loot instantly.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f0eb' },
    { media: '(prefers-color-scheme: dark)', color: '#0c0c12' },
  ],
};

/**
 * Runs before the first paint so a dark-mode capsuleer never gets a white flash.
 * Kept tiny and dependency-free on purpose.
 */
const themeInitScript = `(function(){try{var s=localStorage.getItem('ded-theme');var d=s==='dark'||(!s&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = normalizeLocale(cookieStore.get(LOCALE_COOKIE)?.value);

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <I18nProvider initialLocale={locale}>
          <TooltipProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <Suspense fallback={null}>
              <UrlToaster />
            </Suspense>
            <Toaster richColors position="top-right" />
          </TooltipProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
