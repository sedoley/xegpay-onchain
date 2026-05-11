'use client';

import { 
  Transaction, 
  TransactionButton, 
  TransactionStatus, 
  TransactionStatusAction, 
  TransactionStatusLabel 
} from '@coinbase/onchainkit/transaction'; 
import { base } from 'viem/chains';
import WalletWrapper from '../components/WalletWrapper';

// THE "HOW-TO" FOR YOUR CONTRACT
const XEG_PAY_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "token", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"},
      {"internalType": "string", "name": "referenceId", "type": "string"}
    ],
    "name": "payBill",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

// THE "HOW-TO" FOR USDC (To allow the payment)
const USDC_ABI = [
  {
    "name": "approve",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [
      {"name": "spender", "type": "address"},
      {"name": "amount", "type": "uint256"}
    ],
    "outputs": [{"name": "", "type": "bool"}]
  }
] as const;

export default function Page() {
  const XEG_CONTRACT = '0x1fE534C537Bc53f5AAe1fD04162c2e8A0FE5323C';
  const USDC_TOKEN = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
  const AMOUNT = BigInt(1000000); // $1.00 USDC (USDC has 6 decimals)

  // MULTI-CALL: First we Approve, then we Pay.
  const calls = [
    {
      address: USDC_TOKEN,
      abi: USDC_ABI,
      functionName: 'approve',
      args: [XEG_CONTRACT, AMOUNT],
    },
    {
      address: XEG_CONTRACT,
      abi: XEG_PAY_ABI,
      functionName: 'payBill',
      args: [USDC_TOKEN, AMOUNT, 'INV-001'],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white font-sans">
      <header className="flex justify-between items-center p-6 border-b border-slate-800">
        <span className="text-2xl font-black italic tracking-tighter text-blue-500">XEGpay</span>
        <WalletWrapper text="Connect" />
      </header>

      <main className="flex flex-col items-center justify-center flex-grow p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-6 text-center">Payment Portal</h2>
          
          <div className="bg-black p-4 rounded-xl mb-8 border border-slate-800">
            <div className="flex justify-between mb-2">
              <span className="text-slate-400">Merchant</span>
              <span>XEGpay Gateway</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span className="text-slate-400">Total Due</span>
              <span className="text-blue-400">1.00 USDC</span>
            </div>
          </div>
          
          <Transaction
            chainId={base.id}
            calls={calls}
            onSuccess={(receipt) => alert('Payment Successful!')}
          >
            <TransactionButton 
              text="Pay Now" 
              className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold"
            />
            <TransactionStatus>
              <TransactionStatusLabel className="text-center mt-2 text-sm" />
              <TransactionStatusAction />
            </TransactionStatus>
          </Transaction>
        </div>
      </main>
    </div>
  );
}
