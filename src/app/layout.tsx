import type { Metadata } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { I18nProvider } from '@/lib/i18n';
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
  title: 'DED Tracker — EVE Online Loot Tracker',
  description: 'Log your EVE Online DED escalation profitability. Track factions, evaluate your loot instantly via Janice, and maximize your ISK.',
  keywords: ['EVE Online', 'DED Tracker', 'Loot Appraiser', 'ISK', 'Janice', 'EVE DED', 'Abyssal'],
  openGraph: {
    title: 'DED Tracker — EVE Online',
    description: 'Track your EVE Online DED escalation profitability, appraise your loot, and check your PNL!',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DED Tracker',
    description: 'Track your EVE Online DED escalation profitability and evaluate your loot instantly.',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <I18nProvider>
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
