"use client";

import { useState, useEffect, use } from 'react'; // 👈 1. Import `use` from React
import { ethers } from 'ethers';
import { useWallet } from '@/context/WalletContext';
import { type Dataset } from '@/components/common/DatasetCard';

// 👈 2. Update the type for params to be a Promise
const DatasetDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { contract } = useWallet();
  
  // 👈 3. "Unwrap" the params Promise to get the id
  const { id: datasetId } = use(params);

  useEffect(() => {
    const fetchDatasetDetails = async () => {
      if (!contract || datasetId === undefined) return;

      try {
        const tokenId = Number(datasetId);
        const onChainDataset = await contract.getDatasetById(tokenId);

        if (onChainDataset && onChainDataset.name !== "") {
          const formattedDataset: Dataset = {
            id: Number(onChainDataset.id),
            name: onChainDataset.name,
            description: onChainDataset.description,
            category: onChainDataset.category,
            ownerAddress: onChainDataset.owner,
            price: ethers.formatEther(onChainDataset.price) + " ETH",
            format: onChainDataset.format,
          };
          setDataset(formattedDataset);
        } else {
          setError("Dataset not found.");
        }
      } catch (err) {
        console.error("Failed to fetch dataset details:", err);
        setError("Failed to load dataset details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDatasetDetails();
  }, [contract, datasetId]);

  // ... the rest of your rendering logic remains the same ...
  if (isLoading) {
    return <div className="text-center p-10">Loading dataset details...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  if (!dataset) {
    return <div className="text-center p-10">Dataset not found.</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold">{dataset.name}</h1>
            <span className="bg-indigo-600 text-white text-sm font-medium px-3 py-1 rounded-full">{dataset.category}</span>
        </div>
        <p className="text-gray-400 mb-6">{dataset.description}</p>
        
        <div className="border-t border-gray-700 pt-4">
          <h3 className="text-lg font-semibold mb-2">Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Owner</p>
              <p className="font-mono break-all">{dataset.ownerAddress}</p>
            </div>
            <div>
              <p className="text-gray-500">Price</p>
              <p className="font-semibold text-lg">{dataset.price}</p>
            </div>
            <div>
              <p className="text-gray-500">Format</p>
              <p>{dataset.format}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg">
            Purchase Access
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatasetDetailPage;