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
  title: 'Gaming Zone | Premium Accounts, Tools & Custom Orders',
  description:
    'Your ultimate marketplace for premium gaming accounts, digital tools, subscriptions, VCCs & custom orders.',
  keywords: [
    'Gaming Zone',
    'Minecraft Accounts',
    'Xbox Game Pass',
    'Steam Accounts',
    'VCC',
    'Virtual Credit Card',
    'Hotmail Tools',
    'Netflix Accounts',
    'Crunchyroll Premium',
    'Custom Order Gaming',
  ],
  openGraph: {
    title: 'Gaming Zone | Premium Gaming Accounts & Digital Tools',
    description:
      'Buy premium gaming accounts, VCCs, digital tools, and subscriptions with instant delivery & custom order support.',
    url: 'https://gammingzone.vercel.app',
    siteName: 'Gaming Zone Store',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gaming Zone | Premium Gaming Accounts & Digital Tools',
    description:
      'Instant delivery on Xbox Game Pass, Steam, Minecraft, Netflix, VCCs & Custom Orders.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable}`}>
      <body
        className={`${inter.className} bg-dark-900 text-white antialiased overflow-x-hidden`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
