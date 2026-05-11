import { http, cookieStorage, createConfig, createStorage } from 'wagmi';
import { base } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';

export function getConfig() {
  return createConfig({
    chains: [base],
    connectors: [
      coinbaseWallet({
        appName: 'XEGpay',
        preference: 'all', // supports both Smart Wallet and EOA
        version: '4',
      }),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC_URL),
    },
  });
}

declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
