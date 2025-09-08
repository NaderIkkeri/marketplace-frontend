// src/context/WalletContext.tsx
"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { ethers } from 'ethers';

// Define the shape of our context data
interface WalletContextType {
  walletAddress: string;
  isModalOpen: boolean;
  connectWallet: () => Promise<void>;
  closeModal: () => void;
  provider: ethers.JsonRpcProvider | null;
  signer: ethers.JsonRpcSigner | null;
}

// Create the context
const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Create the Provider component
export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletAddress, setWalletAddress] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Add state for ethers provider and signer
  const [provider, setProvider] = useState<ethers.JsonRpcProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);

  useEffect(() => {
    // 2. Create the provider connection to Sepolia
    const rpcUrl = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL;
    if (rpcUrl) {
      const newProvider = new ethers.JsonRpcProvider(rpcUrl);
      setProvider(newProvider);

      // 3. Test the connection by getting the latest block number
      newProvider.getBlockNumber()
        .then(blockNumber => console.log(`Successfully connected to Sepolia. Latest block: ${blockNumber}`))
        .catch(error => console.error("Failed to connect to Sepolia:", error));
    }
  }, []);

  const closeModal = () => setIsModalOpen(false);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        // 4. Use ethers to wrap the browser's provider and get a signer
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        const newSigner = await browserProvider.getSigner();
        setSigner(newSigner);
        
        const address = await newSigner.getAddress();
        setWalletAddress(address); // Store the full address now
        
        console.log("Connected Wallet:", address);
      } catch (error) {
        console.error("User rejected request:", error);
      }
    } else {
      setIsModalOpen(true);
    }
  };

  // We no longer show the truncated address on the button, so we'll do it in the Navbar
  const displayAddress = walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "";

  return (
    <WalletContext.Provider value={{ walletAddress, isModalOpen, connectWallet, closeModal, provider, signer }}>
      {children}
    </WalletContext.Provider>
  );
}

// Create a custom hook to use the context
export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}