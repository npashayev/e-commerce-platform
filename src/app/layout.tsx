import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Providers from '@/lib/contexts/Providers';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/shared/navbar/Navbar';
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { SITE_NAME, SITE_DESCRIPTION, SITE_KEYWORDS } from '@/lib/constants/seo';

config.autoAddCss = false;

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} - Discover Products You'll Love`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: SITE_NAME }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: SITE_NAME,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <Navbar />
          {children}
          <Toaster
            toastOptions={{
              style: {
                fontSize: '14px',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
