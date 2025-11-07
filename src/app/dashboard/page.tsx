'use client';

import { useWallet } from '@/context/WalletContext';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers'; // Import ethers

// We'll update this later to be the full dataset type
interface Dataset {
  id: string; // tokenId
}

export default function DashboardPage() {
  // Get the contract from the context
  const { walletAddress, provider, contract } = useWallet(); 
  
  // --- State for "My Datasets" ---
  const [myDatasets, setMyDatasets] = useState<Dataset[]>([]);
  const [isLoadingDatasets, setIsLoadingDatasets] = useState(true);

  // --- State for "My Purchases" ---
  const [myPurchases, setMyPurchases] = useState<Dataset[]>([]);
  const [isLoadingPurchases, setIsLoadingPurchases] = useState(true);

  // --- Effect to fetch "My Datasets" (Owned NFTs) ---
  useEffect(() => {
    const fetchMyDatasetIds = async () => {
      // Wait until the contract and wallet are ready
      if (contract && walletAddress) {
        try {
          setIsLoadingDatasets(true);
          
          const balanceBigInt = await contract.balanceOf(walletAddress);
          const balance = Number(balanceBigInt);

          if (balance === 0) {
            setMyDatasets([]);
            setIsLoadingDatasets(false);
            return;
          }

          const tokenIdPromises = [];
          for (let i = 0; i < balance; i++) {
            tokenIdPromises.push(contract.tokenOfOwnerByIndex(walletAddress, i));
          }
          const tokenIds = await Promise.all(tokenIdPromises);

          const datasets = tokenIds.map(tokenId => ({
            id: tokenId.toString(),
          }));
          
          setMyDatasets(datasets);

        } catch (error) {
          console.error("Failed to fetch dataset IDs:", error);
        } finally {
          setIsLoadingDatasets(false);
        }
      }
    };

    fetchMyDatasetIds();
  }, [contract, walletAddress]);


  // --- Effect to fetch "My Purchases" (Events) ---
  useEffect(() => {
    const fetchMyPurchases = async () => {
      // Wait until the contract and wallet are ready
      if (contract && walletAddress) {
        try {
          setIsLoadingPurchases(true);

          const filter = contract.filters.DatasetPurchased(null, walletAddress);

          const events = await contract.queryFilter(filter);

          const purchasedIds = new Set<string>();
          events.forEach(event => {
            
            // --- THIS IS THE FIX ---
            // Use 'in' operator to safely check if 'args' exists on the event
            if ('args' in event && event.args && event.args.tokenId) {
              purchasedIds.add(event.args.tokenId.toString());
            }
          });

          const datasets = Array.from(purchasedIds).map(id => ({
            id: id,
          }));

          setMyPurchases(datasets);

        } catch (error) {
          console.error("Failed to fetch purchase events:", error);
        } finally {
          setIsLoadingPurchases(false);
        }
      }
    };

    fetchMyPurchases();
  }, [contract, walletAddress]);


  // --- Page Rendering Logic ---

  // Show loading state while wallet context initializes
  if (provider === null) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading wallet context...</p>
      </div>
    );
  }

  // Show message if wallet is not connected
  if (!walletAddress) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>
        <p className="text-gray-400 mb-4">Please connect your wallet to view your dashboard.</p>
      </div>
    );
  }

  // Show dashboard when wallet is connected
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>

      <div className="space-y-8">
        {/* --- "My Datasets" Section --- */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">My Datasets</h2>
          
          {isLoadingDatasets && (
            <p className="text-gray-400">Loading your datasets...</p>
          )}

          {!isLoadingDatasets && myDatasets.length === 0 && (
            <p className="text-gray-400">You do not own any datasets yet.</p>
          )}

          {!isLoadingDatasets && myDatasets.length > 0 && (
            <div className="space-y-2">
              <p>You own {myDatasets.length} dataset(s):</p>
              <ul className="list-disc list-inside">
                {myDatasets.map((dataset) => (
                  <li key={dataset.id}>Token ID: {dataset.id}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* --- "My Purchases" Section (UPDATED) --- */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">My Purchases</h2>
          
          {isLoadingPurchases && (
            <p className="text-gray-400">Loading your purchase history...</p>
          )}

          {!isLoadingPurchases && myPurchases.length === 0 && (
            <p className="text-gray-400">You have not purchased any datasets yet.</p>
          )}

          {!isLoadingPurchases && myPurchases.length > 0 && (
            <div className="space-y-2">
              <p>You have purchased {myPurchases.length} dataset(s):</p>
              <ul className="list-disc list-inside">
                {myPurchases.map((dataset) => (
                  <li key={dataset.id}>Token ID: {dataset.id}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}