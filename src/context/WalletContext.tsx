"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { ethers } from 'ethers';
import contractABI from '@/contracts/DatasetNFT.json';
import { CONTRACT_ADDRESS } from '@/config'; // 👈 We will use this constant

interface WalletContextType {
  walletAddress: string;
  isModalOpen: boolean;
  connectWallet: () => Promise<void>;
  closeModal: () => void;
  provider: ethers.JsonRpcProvider | null;
  signer: ethers.JsonRpcSigner | null;
  contract: ethers.Contract | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletAddress, setWalletAddress] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [provider, setProvider] = useState<ethers.JsonRpcProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    const initEthers = async () => {
      const rpcUrl = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL;
      
      // 👈 We now use the imported CONTRACT_ADDRESS constant
      if (rpcUrl && CONTRACT_ADDRESS) {
        const newProvider = new ethers.JsonRpcProvider(rpcUrl);
        setProvider(newProvider);

        // 👈 Use the constant to create the contract instance
        const newContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, newProvider);
        setContract(newContract);

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

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}