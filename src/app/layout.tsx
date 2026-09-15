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
