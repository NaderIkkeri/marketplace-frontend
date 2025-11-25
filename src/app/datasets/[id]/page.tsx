// src/app/datasets/[id]/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { type Dataset } from '@/components/common/DatasetCard';
import { useWallet } from '@/context/WalletContext';
import { toast } from 'react-hot-toast';

// --- MOCK DATA ---
const allDatasets: Dataset[] = [
  {
    id: 1,
    name: 'Global Climate Indicators',
    description: 'A comprehensive dataset tracking key climate trends, temperature anomalies, and CO2 levels from 1958 to the present. It includes monthly readings from the Mauna Loa Observatory and is ideal for time-series analysis and environmental modeling.',
    category: 'Environment',
    ownerAddress: '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2',
    price: '0.1 ETH',
    format: 'CSV',
  },
  {
    id: 2,
    name: 'E-commerce Customer Behavior',
    description: 'Anonymized user interaction and purchase data from a major online retailer over a full year. This dataset is perfect for market basket analysis, customer segmentation, and building recommendation engines.',
    category: 'Retail',
    ownerAddress: '0x4B20993Bc481177ec7E8f571ceCaE849e22082Db',
    price: '0.5 ETH',
    format: 'Parquet',
  },
];

// --- HELPER FUNCTION ---
const truncateAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(address.length - 4)}`;
};

// --- THE PAGE COMPONENT ---
const DatasetDetailPage = ({ params }: { params: { id: string } }) => {
  const { contract, walletAddress } = useWallet();
  const [isBuying, setIsBuying] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  // Find the dataset by its ID from the URL params.
  const dataset = allDatasets.find(d => d.id === parseInt(params.id, 10));

  // --- LOGIC: Check Access (Ownership or Purchase) ---
  useEffect(() => {
    const checkAccess = async () => {
      if (!contract || !walletAddress || !dataset) return;

      try {
        // 1. Check if the logged-in user is the creator (Owner)
        if (dataset.ownerAddress.toLowerCase() === walletAddress.toLowerCase()) {
          setHasAccess(true);
          return;
        }

        // 2. Check if the user has already purchased this dataset
        // We look for past "DatasetPurchased" events for this specific ID and User
        const filter = contract.filters.DatasetPurchased(dataset.id, walletAddress);
        const events = await contract.queryFilter(filter);

        if (events.length > 0) {
          setHasAccess(true);
        }
      } catch (error) {
        console.error("Error checking access:", error);
      }
    };

    checkAccess();
  }, [contract, walletAddress, dataset]);

  // --- LOGIC: Handle Purchase ---
  const handlePurchase = async () => {
    if (!contract || !dataset) return;
    setIsBuying(true);

    try {
      // Convert "0.1 ETH" string to Wei
      const priceString = dataset.price.replace(' ETH', '');
      const priceInWei = ethers.parseEther(priceString);

      const tx = await contract.purchaseDataset(dataset.id, {
        value: priceInWei
      });

      toast.loading("Processing transaction...", { id: 'tx' });
      await tx.wait(); // Wait for confirmation
      
      toast.success("Purchase successful!", { id: 'tx' });
      setHasAccess(true); // Grant access immediately without refresh

    } catch (error: any) {
      console.error("Purchase failed:", error);
      toast.error(error.reason || "Transaction failed", { id: 'tx' });
    } finally {
      setIsBuying(false);
    }
  };

  // If no dataset is found, display a message.
  if (!dataset) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <h1 className="text-2xl font-bold text-gray-300">Dataset not found.</h1>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <span className="bg-indigo-600 text-white text-sm font-semibold px-3 py-1.5 rounded-full mb-2 inline-block">
            {dataset.category}
          </span>
          <h1 className="text-4xl font-extrabold text-gray-100 mt-2">{dataset.name}</h1>
          <p className="text-gray-400 mt-3 text-lg">{dataset.description}</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Metadata */}
          <div className="lg:col-span-1 bg-gray-800 border border-gray-700 rounded-lg p-6 h-fit">
            <h3 className="text-xl font-bold mb-6 text-gray-200 border-b border-gray-700 pb-3">Dataset Details</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Owner</span>
                <span className="font-mono text-indigo-400">{truncateAddress(dataset.ownerAddress)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Price</span>
                <span className="font-semibold text-gray-200">{dataset.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Format</span>
                <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-md">{dataset.format}</span>
              </div>
               <div className="flex justify-between">
                <span className="text-gray-400">Last Updated</span>
                <span className="text-gray-200">2 weeks ago</span>
              </div>
            </div>

            {/* --- ACTION BUTTON SECTION --- */}
            <div className="mt-8">
              {!walletAddress ? (
                <button disabled className="w-full bg-gray-700 text-gray-400 font-bold py-3 rounded-lg cursor-not-allowed">
                  Connect Wallet to View
                </button>
              ) : hasAccess ? (
                // IF OWNED: Show Download Button
                <button 
                  onClick={() => toast.success("Downloading...")}
                  className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Download Dataset
                </button>
              ) : (
                // IF NOT OWNED: Show Purchase Button
                <button 
                  onClick={handlePurchase}
                  disabled={isBuying}
                  className={`w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isBuying ? 'opacity-70 cursor-wait' : ''}`}
                >
                  {isBuying ? 'Processing...' : 'Purchase Access'}
                </button>
              )}
            </div>
            {/* ----------------------------- */}

          </div>

          {/* Right Column: Further Details/Preview (Placeholder) */}
          <div className="lg:col-span-2 bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-200">File Preview</h3>
            <p className="text-gray-500">
              A preview of the data files will be available here in a future update. This section could include file names, sizes, or a sample of the data rows.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetDetailPage;