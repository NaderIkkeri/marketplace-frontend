// src/components/Layout.tsx
"use client";

import Navbar from './Navbar';
import Footer from './Footer';
import NoWalletModal from './common/NoWalletModal';
import { useWallet } from '@/context/WalletContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  // 1. Get walletAddress from the context
  const { isModalOpen, closeModal, walletAddress } = useWallet();

  // 2. Create the truncated address for display
  const displayAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Navbar />

      {/* 3. NEW: Add the address bar, only shows if connected */}
      {walletAddress && (
        <div className="bg-gray-700 text-gray-300 text-sm text-center py-1 shadow-inner">
          Connected as: {displayAddress}
        </div>
      )}

      <main className="flex-grow container mx-auto p-4">{children}</main>
      <Footer />
      <NoWalletModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}