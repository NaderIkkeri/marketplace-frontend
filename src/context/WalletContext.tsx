// src/context/WalletContext.tsx
"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { ethers } from 'ethers';
import contractABI from '@/contracts/DatasetNFT.json';

// Define the shape of our context data, including the contract
interface WalletContextType {
  walletAddress: string;
  isModalOpen: boolean;
  connectWallet: () => Promise<void>;
  closeModal: () => void;
  provider: ethers.JsonRpcProvider | null;
  signer: ethers.JsonRpcSigner | null;
  contract: ethers.Contract | null;
}

// Create the context
const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Create the Provider component
export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletAddress, setWalletAddress] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [provider, setProvider] = useState<ethers.JsonRpcProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    const initEthers = async () => {
      const rpcUrl = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL;
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

      if (rpcUrl && contractAddress) {
        // Create the read-only provider connection to Sepolia
        const newProvider = new ethers.JsonRpcProvider(rpcUrl);
        setProvider(newProvider);

        // Create a read-only instance of the contract
        const newContract = new ethers.Contract(contractAddress, contractABI, newProvider);
        setContract(newContract);

        // Test the connection
        try {
          const blockNumber = await newProvider.getBlockNumber();
          console.log(`Successfully connected to Sepolia. Latest block: ${blockNumber}`);
        } catch (error) {
          console.error("Failed to connect to Sepolia:", error);
        }
      }
    };
    initEthers();
  }, []);

  const closeModal = () => setIsModalOpen(false);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        const newSigner = await browserProvider.getSigner();
        setSigner(newSigner);
        
        const address = await newSigner.getAddress();
        setWalletAddress(address);
        
        // When the user connects, create a writeable contract instance with their signer
        if (contract) {
          const contractWithSigner = contract.connect(newSigner) as ethers.Contract;
          setContract(contractWithSigner);
        }

      } catch (error) {
        console.error("User rejected request:", error);
      }
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <WalletContext.Provider value={{ walletAddress, isModalOpen, connectWallet, closeModal, provider, signer, contract }}>
      {children}
    </WalletContext.Provider>
  );
}

// Create a custom hook to easily use the context in other components
export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}