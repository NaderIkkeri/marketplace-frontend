// src/components/Navbar.tsx
"use client";

import Link from 'next/link';
import { useWallet } from '@/context/WalletContext';

export default function Navbar() {
  const { walletAddress, connectWallet } = useWallet();

  const buttonText = walletAddress ? "Connected" : "Connect Wallet";

  const buttonStyles = walletAddress
    ? "bg-green-600 text-white font-bold py-2 px-4 rounded cursor-not-allowed"
    : "bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";

  return (
    <header className="bg-gray-800 text-white p-4 sticky top-0 z-50">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">DataMarketplace</Link>
        <ul className="flex items-center space-x-6">
          <li><Link href="/" className="hover:text-gray-300">Home</Link></li>
          <li><Link href="/browse" className="hover:text-gray-300">Browse Datasets</Link></li>
          <li>
            <button
              onClick={connectWallet}
              className={buttonStyles}
              disabled={!!walletAddress}
            >
              {buttonText}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}