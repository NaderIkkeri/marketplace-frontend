// src/components/Layout.tsx
"use client";

import Navbar from './Navbar';
import Footer from './Footer';
import NoWalletModal from './common/NoWalletModal';
import { useWallet } from '@/context/WalletContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isModalOpen, closeModal } = useWallet();

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Navbar />
      <main className="flex-grow container mx-auto p-4">{children}</main>
      <Footer />
      <NoWalletModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}