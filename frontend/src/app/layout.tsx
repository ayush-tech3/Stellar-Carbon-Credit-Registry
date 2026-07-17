import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/components/shared/QueryProvider';

import { WalletProvider } from '@/lib/wallet/provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CarbonTrack - Stellar Carbon Credit Registry',
  description: 'A transparent, tamper-proof carbon credit registry on the Stellar blockchain',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <QueryProvider>
          <WalletProvider>
            {children}
          </WalletProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
