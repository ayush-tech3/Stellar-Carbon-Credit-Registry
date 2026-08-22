import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/components/shared/QueryProvider';
import { WalletProvider } from '@/lib/wallet/provider';
import { ClientProviders } from '@/components/shared/ClientProviders';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CarbonTrack - Stellar Carbon Credit Registry',
  description: 'A transparent, tamper-proof carbon credit registry on the Stellar blockchain. Issue, transfer, and retire carbon credits with Soroban smart contracts.',
  keywords: ['carbon credits', 'stellar', 'soroban', 'blockchain', 'sustainability', 'climate', 'carbon offset'],
  openGraph: {
    title: 'CarbonTrack - Stellar Carbon Credit Registry',
    description: 'A transparent, tamper-proof carbon credit registry built on Stellar Soroban.',
    type: 'website',
    url: 'https://carbon-credit-registry.netlify.app',
  },
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
            <ClientProviders>
              {children}
            </ClientProviders>
          </WalletProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
