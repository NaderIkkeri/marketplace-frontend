// src/app/dashboard/page.tsx
"use client";

import { useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '@/context/WalletContext';
import DatasetCard, { type Dataset } from '@/components/common/DatasetCard';
import Link from 'next/link';
import { Wallet, Database, ShoppingCart, Loader2 } from 'lucide-react';
import { CONTRACT_ADDRESS, CONTRACT_CREATION_BLOCK } from '@/config';

const DashboardPage = () => {
  const { contract, provider, walletAddress } = useWallet();
  
  // State for all our data
  const [balance, setBalance] = useState<string | null>(null);
  const [ownedDatasets, setOwnedDatasets] = useState<Dataset[]>([]);
  const [purchasedDatasets, setPurchasedDatasets] = useState<Dataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!contract || !provider || !walletAddress) {
        setIsLoading(true);
        return;
      }

      setIsLoading(true);
      try {
        // 1. Fetch Wallet Balance
        const balanceWei = await provider.getBalance(walletAddress);
        setBalance(ethers.formatEther(balanceWei).substring(0, 6));

        // 2. Fetch Owned Datasets
        const ownedData = await contract.getDatasetsByOwner(walletAddress);
        const formattedOwned = ownedData.map((dataset: any) => ({
          id: Number(dataset.id),
          name: dataset.name,
          description: dataset.description,
          category: dataset.category,
          ownerAddress: dataset.owner,
          price: ethers.formatEther(dataset.price) + " ETH",
          format: dataset.format,
        }));
        setOwnedDatasets(formattedOwned);

        // --- 3. ROBUST Fetch Purchased Datasets (with Pagination) ---
        const purchaseFilter = contract.filters.DatasetPurchased(null, walletAddress);
        const currentBlock = await provider.getBlockNumber();
        const ALL_PURCHASE_EVENTS: ethers.EventLog[] = [];

        // We fetch in chunks of 50,000 blocks to avoid Alchemy limits
        const CHUNK_SIZE = 50000; 
        for (let i = CONTRACT_CREATION_BLOCK; i <= currentBlock; i += CHUNK_SIZE) {
            const end = Math.min(i + CHUNK_SIZE - 1, currentBlock);
            console.log(`Fetching events from block ${i} to ${end}...`);
            try {
                const chunkEvents = await contract.queryFilter(purchaseFilter, i, end);
                // Filter to only include EventLog types that have args
                const eventLogs = chunkEvents.filter((event): event is ethers.EventLog => 'args' in event);
                ALL_PURCHASE_EVENTS.push(...eventLogs);
            } catch (chunkError) {
                console.error(`Failed to fetch chunk ${i}-${end}:`, chunkError);
                // Optional: you could try a smaller chunk size here if it fails
            }
        }

        const tokenIds = ALL_PURCHASE_EVENTS.map(event => event.args.tokenId);

        // 4. Fetch details for each purchased dataset
        // Use Promise.allSettled to avoid one failure breaking everything
        const purchasedResults = await Promise.allSettled(
          tokenIds.map(tokenId => contract.getDatasetById(tokenId))
        );

        const validPurchased = purchasedResults
            .filter(result => result.status === 'fulfilled')
            .map(result => (result as PromiseFulfilledResult<any>).value);

        const formattedPurchased = validPurchased.map((dataset: any) => ({
          id: Number(dataset.id),
          name: dataset.name,
          description: dataset.description,
          category: dataset.category,
          ownerAddress: dataset.owner,
          price: ethers.formatEther(dataset.price) + " ETH",
          format: dataset.format,
        }));
        setPurchasedDatasets(formattedPurchased);

      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [contract, provider, walletAddress]);

  // Show a connect message if wallet is not connected
  if (!walletAddress) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Wallet className="w-16 h-16 mb-4 text-indigo-400" />
        <h2 className="text-2xl font-semibold mb-2">Connect Your Wallet</h2>
        <p className="text-gray-400">Please connect your wallet to view your personal dashboard.</p>
      </div>
    );
  }

  // Show a loading spinner while fetching data
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Loader2 className="w-16 h-16 mb-4 text-indigo-400 animate-spin" />
        <h2 className="text-2xl font-semibold mb-2">Loading Your Dashboard...</h2>
        <p className="text-gray-400">Fetching your on-chain data from Sepolia.</p>
      </div>
    );
  }

  // --- Render the Full Dashboard ---
  return (
    <div className="p-4 sm:p-6 lg:p-8 text-gray-100">
      <h1 className="text-4xl font-bold mb-8">My Dashboard</h1>

      {/* --- Stat Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard 
          title="Sepolia Balance" 
          value={balance ? `${balance} ETH` : "0 ETH"} 
          icon={<Wallet className="w-6 h-6" />} 
        />
        <StatCard 
          title="Datasets Owned" 
          value={ownedDatasets.length.toString()} 
          icon={<Database className="w-6 h-6" />} 
        />
        <StatCard 
          title="Datasets Purchased" 
          value={purchasedDatasets.length.toString()} 
          icon={<ShoppingCart className="w-6 h-6" />} 
        />
      </div>

      {/* --- My Datasets (Owned) --- */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">My Datasets (Owned)</h2>
        {ownedDatasets.length === 0 ? (
          <p className="text-gray-400">You haven't created any datasets yet. <Link href="/create" className="text-indigo-400 hover:underline">Create one now!</Link></p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ownedDatasets.map((dataset) => (
              <DatasetCard key={dataset.id} dataset={dataset} />
            ))}
          </div>
        )}
      </div>

      {/* --- My Purchased Datasets --- */}
      <div>
        <h2 className="text-2xl font-bold mb-4">My Purchases</h2>
        {purchasedDatasets.length === 0 ? (
          <p className="text-gray-400">You haven't purchased any datasets. <Link href="/browse" className="text-indigo-400 hover:underline">Browse the marketplace.</Link></p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchasedDatasets.map((dataset) => (
              <DatasetCard key={dataset.id} dataset={dataset} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// A helper component for the stat cards
const StatCard = ({ title, value, icon }: { title: string, value: string, icon: ReactNode }) => (
  <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex items-center space-x-4">
    <div className="p-3 bg-indigo-600 rounded-full">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-400 font-medium">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

export default DashboardPage;