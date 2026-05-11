'use client';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  coinbaseWallet,
  metaMaskWallet,
  rainbowWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { useMemo } from 'react';
import { http, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { NEXT_PUBLIC_WC_PROJECT_ID } from './config';

export function useWagmiConfig() {
  const projectId = NEXT_PUBLIC_WC_PROJECT_ID ?? '';

  return useMemo(() => {
    // FIX 4: Invoke wallet constructors with required appName/projectId args
    const connectors = connectorsForWallets(
      [
        {
          groupName: 'Recommended',
          wallets: [coinbaseWallet],
        },
        {
          groupName: 'Other Wallets',
          // metaMaskWallet and rainbowWallet also need projectId for WalletConnect
          wallets: [rainbowWallet, metaMaskWallet],
        },
      ],
      {
        appName: 'XEGpay',
        projectId,
      },
    );

    return createConfig({
      chains: [base],
      multiInjectedProviderDiscovery: true,
      connectors,
      ssr: true,
      transports: {
        // FIX 5: Use a reliable RPC URL; fallback to public if env var not set
        [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC_URL ?? 'https://mainnet.base.org'),
      },
    });
  }, [projectId]);
}
