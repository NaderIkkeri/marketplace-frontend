// src/context/WalletContext.tsx
"use client";

import { useState, createContext, useContext, ReactNode } from 'react';

interface WalletContextType {
  walletAddress: string;
  isModalOpen: boolean;
  connectWallet: () => Promise<void>;
  closeModal: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletAddress, setWalletAddress] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => setIsModalOpen(false);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const address = accounts[0];
        const truncated = address.slice(0, 6) + "..." + address.slice(-4);
        setWalletAddress(truncated);
      } catch (error) {
        console.error("User rejected request:", error);
      }
    } else {
      // If no wallet is found, open the modal
      setIsModalOpen(true);
    }
  };

  return (
    <WalletContext.Provider value={{ walletAddress, isModalOpen, connectWallet, closeModal }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}