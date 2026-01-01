import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '../components/Header';
import { LanguageProvider } from '../contexts/LanguageContext';
import WebSiteStructuredData from './../components/WebSiteStructuredData'; // ADD THIS


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'LocalPulse Canada - Community Events Across Canadian Cities',
    template: '%s | LocalPulse Canada'
  },
  description: 'Discover local events, community gatherings, and cultural activities in Toronto, Montreal, Vancouver, Calgary, Ottawa, and Edmonton. Join discussions and stay connected with your city.',
  keywords: [
    'Canada events',
    'Toronto community',
    'Montreal activities', 
    'Vancouver gatherings',
    'local events Canada',
    'community events',
    'Canadian cities',
    'event discovery'
  ],
  authors: [{ name: 'LocalPulse Canada' }],
  creator: 'LocalPulse Canada',
  publisher: 'LocalPulse Canada',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://localpulse-canada.vercel.app'),
  alternates: {
    canonical: '/',
    languages: {
      'en-CA': '/',
      'fr-CA': '/fr',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: 'https://localpulse-canada.vercel.app',
    title: 'LocalPulse Canada - Community Events',
    description: 'Discover local events and community discussions across Canadian cities',
    siteName: 'LocalPulse Canada',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LocalPulse Canada Community Events',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LocalPulse Canada - Community Events',
    description: 'Discover local events and community discussions across Canadian cities',
    images: ['/twitter-image.png'],
    creator: '@localpulse_ca',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#FF0000" />
      </head>
      <body className={inter.className}>
        <LanguageProvider>
          <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <Header />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
            <footer className="bg-gray-800 text-white py-8 mt-12">
              <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8">
                  <div>
                    <p className="text-lg font-semibold">LocalPulse Canada</p>
                    <p className="text-gray-400 mt-2 text-sm">
                      Connecting communities across Canadian cities since 2024
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold mb-3">Cities</p>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li><a href="/cities/toronto" className="hover:text-white">Toronto</a></li>
                      <li><a href="/cities/montreal" className="hover:text-white">Montreal</a></li>
                      <li><a href="/cities/vancouver" className="hover:text-white">Vancouver</a></li>
                      <li><a href="/cities/calgary" className="hover:text-white">Calgary</a></li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-3">Resources</p>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li><a href="/events" className="hover:text-white">Browse Events</a></li>
                      <li><a href="/discussions" className="hover:text-white">Community Discussions</a></li>
                      <li><a href="/newsletter" className="hover:text-white">Newsletter</a></li>
                      <li><a href="/analytics" className="hover:text-white">Analytics</a></li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-3">Legal</p>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
                      <li><a href="/terms" className="hover:text-white">Terms of Service</a></li>
                      <li><a href="/contact" className="hover:text-white">Contact</a></li>
                      <li><a href="/sitemap.xml" className="hover:text-white">Sitemap</a></li>
                    </ul>
                  </div>
                </div>
                <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                  <p className="text-gray-500 text-sm">
                    © 2024 LocalPulse Canada. All rights reserved.
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}