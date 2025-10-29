"use client";

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '@/context/WalletContext';
import DatasetCard, { type Dataset } from '@/components/common/DatasetCard';
import Link from 'next/link';

const BrowsePage = () => {
  // 1. State to hold our datasets, loading status, and any errors
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. Get the contract instance from our global context
  const { contract } = useWallet();

  useEffect(() => {
    // 3. Define an async function to fetch data
    const fetchDatasets = async () => {
      // Exit if the contract object isn't ready yet
      if (!contract) return;

      try {
        // 4. Call the read-only function on your smart contract
        // IMPORTANT: Make sure your contract has a function named `getAllDatasets`
        const onChainDatasets = await contract.getAllDatasets();

        // 5. Format the raw data from the contract to match our `Dataset` type
        const formattedDatasets = onChainDatasets.map((dataset: any, index: number) => ({
          id: Number(dataset.id), // Using index as a key for now
          name: dataset.name,
          description: dataset.description,
          category: dataset.category,
          ownerAddress: dataset.owner,
          // Convert price from wei (the smallest unit) to ETH
          price: ethers.formatEther(dataset.price) + " ETH", 
          format: dataset.format,
        }));
        
        setDatasets(formattedDatasets);
      } catch (err) {
        console.error("Failed to fetch datasets:", err);
        setError("Failed to load datasets. Please check the console for details.");
      } finally {
        setIsLoading(false); // Stop loading once done
      }
    };

    fetchDatasets();
  }, [contract]); // This hook re-runs only when the contract object is ready

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Browse Datasets</h1>
        
        {/* 6. Conditionally render content based on the state */}
        {isLoading && (
          <p className="text-center text-xl text-gray-400">Loading datasets from the blockchain...</p>
        )}
        
        {error && (
          <p className="text-center text-xl text-red-500">{error}</p>
        )}

        {!isLoading && !error && datasets.length === 0 && (
          <p className="text-center text-xl text-gray-400">No datasets have been created yet.</p>
        )}

        {!isLoading && !error && datasets.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {datasets.map((dataset) => (
              <Link href={`/browse/${dataset.id}`} key={dataset.id}>
                <DatasetCard dataset={{ ...dataset, id: dataset.id + 1 }} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowsePage;