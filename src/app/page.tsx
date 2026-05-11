'use client';
import { useCallback, useMemo } from 'react';
import { useAccount } from 'wagmi';
import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from '@coinbase/onchainkit/transaction';
import type { LifecycleStatus } from '@coinbase/onchainkit/transaction';
import type { ContractFunctionParameters } from 'viem';
import { base } from 'wagmi/chains';
import WalletWrapper from '../components/WalletWrapper';

const XEG_CONTRACT = '0x1fE534C537Bc53f5AAe1fD04162c2e8A0FE5323C' as const;
const USDC_TOKEN = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const;

const USDC_ABI = [
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const;

const XEG_PAY_ABI = [
  {
    name: 'payBill',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'string', name: 'referenceId', type: 'string' },
    ],
    outputs: [],
  },
] as const;

export default function Page() {
  const { address } = useAccount();

  const calls = useMemo<ContractFunctionParameters[]>(
    () => [
      {
        address: USDC_TOKEN,
        abi: USDC_ABI,
        functionName: 'approve',
        args: [XEG_CONTRACT, BigInt(1000000)],
      },
      {
        address: XEG_CONTRACT,
        abi: XEG_PAY_ABI,
        functionName: 'payBill',
        args: [USDC_TOKEN, BigInt(1000000), 'INV-001'],
      },
    ],
    [],
  );

  const handleOnStatus = useCallback((status: LifecycleStatus) => {
    console.log('LifecycleStatus', status);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white font-sans">
      <header className="flex justify-between items-center p-6 border-b border-slate-800">
        <span className="text-2xl font-black italic tracking-tighter text-blue-500">
          XEGpay
        </span>
        <WalletWrapper text="Connect" />
      </header>

      <main className="flex flex-col items-center justify-center flex-grow p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-bold mb-6 text-center">Payment Portal</h2>

          <div className="bg-black p-5 rounded-xl mb-8 border border-slate-800">
            <div className="flex justify-between mb-2">
              <span className="text-slate-500 text-sm">Merchant</span>
              <span className="text-sm font-medium">XEGpay Gateway</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-slate-500 text-sm">Total Due</span>
              <span className="text-2xl font-bold text-blue-400">1.00 USDC</span>
            </div>
          </div>

          {address ? (
            <Transaction
              chainId={base.id}
              calls={calls}
              onStatus={handleOnStatus}
            >
              <TransactionButton
                text="Pay with USDC"
                className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold transition-colors"
              />
              <TransactionStatus>
                <TransactionStatusLabel className="text-center mt-3 text-sm text-slate-400" />
                <TransactionStatusAction className="text-blue-400 hover:text-blue-300 transition-colors" />
              </TransactionStatus>
            </Transaction>
          ) : (
            <p className="text-center text-sm text-slate-400 py-4">
              Connect your wallet to pay.
            </p>
          )}

          <p className="mt-6 text-center text-[10px] text-slate-600 uppercase tracking-widest">
            Mainnet Secure • Base Network
          </p>
        </div>
      </main>
    </div>
  );
}
