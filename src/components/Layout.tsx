"use client";

import Navbar from './Navbar';
import NoWalletModal from './common/NoWalletModal';
import CustomCursor from './common/CustomCursor';
import { useWallet } from '@/context/WalletContext';
import { usePathname } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isModalOpen, closeModal } = useWallet();
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <CustomCursor />
      <Navbar />
      <main className={isHomePage ? '' : 'min-h-screen'}>
        {children}
      </main>
      <NoWalletModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}