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
    const connectors = connectorsForWallets(
      [
        {
          groupName: 'Recommended',
          wallets: [coinbaseWallet],
        },
        {
          groupName: 'Other Wallets',
          wallets: [rainbowWallet, metaMaskWallet],
        },
      ],
      {
        appName: 'XEGpay',
        projectId,
      },
    );

    return createConfig({
      chains: [base], // Only Mainnet
      multiInjectedProviderDiscovery: true,
      connectors,
      ssr: true,
      transports: {
        [base.id]: http(),
      },
    });
  }, [projectId]);
}
