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
      <div className="min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center text-center px-4">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-12 max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
            <Wallet className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-3">Connect Your Wallet</h2>
          <p className="text-gray-400 mb-6">Please connect your wallet to view your personal portfolio.</p>
        </div>
      </div>
    );
  }

  // Show a loading spinner while fetching data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center text-center px-4">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-12 max-w-md">
          <Loader2 className="w-20 h-20 mx-auto mb-6 text-purple-400 animate-spin" />
          <h2 className="text-3xl font-bold mb-3">Loading Portfolio...</h2>
          <p className="text-gray-400">Fetching your on-chain data from Sepolia.</p>
        </div>
      </div>
    );
  }

  // --- Render the Full Dashboard ---
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-gray-100">
      {/* Hero Section */}
      <div className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-3">
            Your <span className="glow-text-purple">Portfolio</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Manage your datasets and track your activity
          </p>

          {/* --- Stat Cards --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Sepolia Balance"
              value={balance ? `${balance} ETH` : "0 ETH"}
              icon={<Wallet className="w-6 h-6" />}
              gradient="from-purple-500/20 to-pink-500/20"
            />
            <StatCard
              title="Datasets Owned"
              value={ownedDatasets.length.toString()}
              icon={<Database className="w-6 h-6" />}
              gradient="from-green-500/20 to-teal-500/20"
            />
            <StatCard
              title="Datasets Purchased"
              value={purchasedDatasets.length.toString()}
              icon={<ShoppingCart className="w-6 h-6" />}
              gradient="from-orange-500/20 to-red-500/20"
            />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* --- My Datasets (Owned) --- */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">My Datasets</h2>
            <Link
              href="/create"
              className="px-5 py-2.5 rounded-full font-semibold bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105"
            >
              Create Dataset
            </Link>
          </div>

          {ownedDatasets.length === 0 ? (
            <div className="text-center py-12 bg-white/5 border border-white/10 rounded-2xl">
              <Database className="w-16 h-16 mx-auto mb-4 text-purple-400 opacity-50" />
              <p className="text-gray-400 mb-4">You haven't created any datasets yet.</p>
              <Link href="/create" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                Create your first dataset →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ownedDatasets.map((dataset) => (
                <Link href={`/browse/${dataset.id}`} key={dataset.id}>
                  <DatasetCard dataset={dataset} />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* --- My Purchased Datasets --- */}
        <div>
          <h2 className="text-3xl font-bold mb-6">My Purchases</h2>
          {purchasedDatasets.length === 0 ? (
            <div className="text-center py-12 bg-white/5 border border-white/10 rounded-2xl">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-purple-400 opacity-50" />
              <p className="text-gray-400 mb-4">You haven't purchased any datasets yet.</p>
              <Link href="/browse" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                Browse marketplace →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchasedDatasets.map((dataset) => (
                <Link href={`/browse/${dataset.id}`} key={dataset.id}>
                  <DatasetCard dataset={dataset} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// A helper component for the stat cards
const StatCard = ({ title, value, icon, gradient }: { title: string, value: string, icon: ReactNode, gradient: string }) => (
  <div className={`bg-gradient-to-br ${gradient} border border-white/10 rounded-2xl p-6 card-hover`}>
    <div className="flex items-center gap-4">
      <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-400 font-medium mb-1">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

export default DashboardPage;