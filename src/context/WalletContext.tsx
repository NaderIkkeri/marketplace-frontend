"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { ethers } from 'ethers';
import contractABI from '@/contracts/DatasetNFT.json';
import { CONTRACT_ADDRESS } from '@/config';
import { toast } from 'react-hot-toast'; 

interface WalletContextType {
  walletAddress: string;
  isModalOpen: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
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
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  
  // Note: We don't need to store the signer in state, 
  // as it's mainly used for signing transactions.
  // The 'contract' state will be updated to hold the 'contract with signer'.

  // --- NEW HELPER FUNCTION ---
  // This function sets up the user's signer and updates the contract
  const setupSigner = async (browserProvider: ethers.BrowserProvider, baseContract: ethers.Contract) => {
    try {
      const newSigner = await browserProvider.getSigner();
      const address = await newSigner.getAddress();
      setWalletAddress(address);

      // Connect the signer to the contract
      const contractWithSigner = baseContract.connect(newSigner) as ethers.Contract;
      setContract(contractWithSigner);

      return address; // Return address for success toast
    } catch (error) {
      console.error("Failed to setup signer:", error);
      toast.error("Could not connect to wallet. Please try again.");
    }
  };

  // --- THIS USEEFFECT IS NOW UPDATED ---
  useEffect(() => {
    const initEthers = async () => {
      const rpcUrl = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL;
      
      if (rpcUrl && CONTRACT_ADDRESS) {
        // 1. Set up the read-only provider and contract
        const newProvider = new ethers.JsonRpcProvider(rpcUrl);
        setProvider(newProvider);
        const newContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, newProvider);
        setContract(newContract); // Set the read-only contract first

        // 2. --- THIS IS THE FIX FOR REFRESHING ---
        // Check if MetaMask is installed
        if (typeof window.ethereum !== "undefined") {
          const browserProvider = new ethers.BrowserProvider(window.ethereum);
          
          // Check if the user is already connected
          const accounts = await browserProvider.listAccounts();
          if (accounts.length > 0) {
            console.log("Wallet already connected. Setting up signer...");
            // If already connected, set up the signer automatically
            await setupSigner(browserProvider, newContract);
          }
        }
        // ------------------------------------------

      }
    };
    initEthers();
  }, []); // <-- Empty array means this runs only ONCE on page load

  const closeModal = () => setIsModalOpen(false);

  // --- THIS FUNCTION IS NOW UPDATED ---
  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined" && provider && contract) {
      try {
        const browserProvider = new ethers.BrowserProvider(window.ethereum);

        // This will prompt the user to connect
        await browserProvider.send("eth_requestAccounts", []);

        // Set up the signer after user connects
        const address = await setupSigner(browserProvider, contract);

        if (address) {
          toast.success('Wallet connected successfully!');
        }

      } catch (error) {
        console.error("User rejected request:", error);
        toast.error('User rejected wallet connection.');
      }
    } else if (!provider || !contract) {
      toast.error('Provider not initialized. Please refresh the page.');
    } else {
      // Only show modal, no toast notification
      setIsModalOpen(true);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress("");
    // Reset contract to read-only version
    if (provider && CONTRACT_ADDRESS) {
      const readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);
      setContract(readOnlyContract);
    }
    toast.success('Wallet disconnected');
  };

  return (
    <WalletContext.Provider value={{ walletAddress, isModalOpen, connectWallet, disconnectWallet, closeModal, provider, signer: null, contract }}>
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