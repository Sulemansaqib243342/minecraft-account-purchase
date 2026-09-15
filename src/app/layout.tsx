import type { Metadata } from 'next';
import { Inter, Orbitron } from 'next/font/google';
import Providers from '@/components/Providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://gammingzone.vercel.app'),
  title: 'Gaming Zone | Premium Gaming Accounts, Digital Tools & Custom Orders',
  description:
    'Your ultimate marketplace for premium gaming accounts (Xbox Game Pass, Steam, Minecraft), digital tools (Hotmail Pass Changer, Bulk Checker), subscriptions (Netflix, Crunchyroll, Discord Nitro), VCCs & Custom Orders.',
  keywords: [
    'Gaming Zone',
    'Gaming Zone Store',
    'Minecraft Accounts',
    'MCFNA Accounts',
    'Xbox Game Pass',
    'Steam Accounts',
    'Virtual Credit Card VCC',
    'Hotmail Pass Changer',
    'Hotmail Bulk Checker',
    'Netflix Accounts',
    'Crunchyroll Premium',
    'Discord Nitro',
    'Custom Order Gaming',
  ],
  alternates: {
    canonical: 'https://gammingzone.vercel.app',
  },
  openGraph: {
    title: 'Gaming Zone | Premium Gaming Accounts, Tools & Custom Orders',
    description:
      'Buy Xbox Game Pass, Steam, Minecraft, Netflix, VCCs, Hotmail tools & custom gaming orders with fast delivery.',
    url: 'https://gammingzone.vercel.app',
    siteName: 'Gaming Zone Store',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gaming Zone Store | Premium Gaming Accounts & Digital Tools',
    description:
      'Instant delivery on Xbox Game Pass, Steam, Minecraft, Netflix, VCCs & Custom Requests.',
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
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'OnlineStore',
  name: 'Gaming Zone Store',
  url: 'https://gammingzone.vercel.app',
  description:
    'Premium marketplace for gaming accounts, Xbox Game Pass, Steam, VCCs, digital tools, and custom orders.',
  email: 'zaydengrey172@gmail.com',
  sameAs: ['https://discord.gg/vGfFcjZPr'],
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'USD',
    lowPrice: '0.30',
    highPrice: '12.00',
    offerCount: '12',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable}`}>
      <head>
        <meta name="theme-color" content="#0d0d12" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.className} bg-dark-900 text-white antialiased overflow-x-hidden`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
