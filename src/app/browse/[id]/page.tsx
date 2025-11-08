"use client";

import { useState, useEffect, use } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '@/context/WalletContext';
import { type Dataset } from '@/components/common/DatasetCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// This helper type was missing ipfsCid
type FullDataset = Dataset & {
  ipfsCid: string; 
};

const DatasetDetailPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const [dataset, setDataset] = useState<FullDataset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- State for Purchasing ---
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState("");

  // --- 1. ADD STATE ---
  const [hasAccess, setHasAccess] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  const { contract, walletAddress } = useWallet();
  const { id: datasetId } = use(params);

  // --- I'VE MOVED THIS FUNCTION UP ---
  const handlePurchase = async () => {
    // Check for wallet connection first
    if (!contract || !walletAddress) {
      setPurchaseStatus("Please connect your wallet first.");
      return;
    }
    if (!dataset) {
      setPurchaseStatus("Dataset details not loaded.");
      return;
    }
    if (dataset.ownerAddress.toLowerCase() === walletAddress.toLowerCase()) {
        setPurchaseStatus("You cannot purchase your own dataset.");
        return;
    }

    try {
      setIsPurchasing(true);
      setPurchaseStatus("Processing purchase...");
      const priceString = dataset.price.split(" ")[0];
      const priceInWei = ethers.parseEther(priceString);

      setPurchaseStatus("Please confirm the transaction in your wallet...");
      
      const tx = await contract.purchaseDataset(dataset.id, {
        value: priceInWei
      });

      setPurchaseStatus("Waiting for transaction confirmation...");
      await tx.wait(1);

      setPurchaseStatus("✅ Purchase successful!");
      setIsPurchasing(false);
      setHasAccess(true); // Grant access right after purchase

    } catch (err: any) {
      console.error("Purchase failed:", err);
      if (err.code === 'ACTION_REJECTED') {
        setPurchaseStatus("Transaction cancelled by user.");
      } else {
          const reason = err.reason || "Check console for details.";
          setPurchaseStatus(`Purchase failed: ${reason}`);
      }
      setIsPurchasing(false);
    }
  };

  // --- Fetch Dataset Details Effect ---
  useEffect(() => {
    const fetchDatasetDetails = async () => {
      if (datasetId === undefined || isNaN(Number(datasetId))) {
        setIsLoading(false);
        setError("Invalid Dataset ID provided in URL.");
        return;
      }
      if (!contract) {
        console.log("Contract context not ready yet.");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const tokenId = Number(datasetId);
        const onChainDataset = await contract.getDatasetById(tokenId);

        if (onChainDataset && onChainDataset.name !== "") {
          const formattedDataset: FullDataset = {
            id: Number(onChainDataset.id),
            name: onChainDataset.name,
            description: onChainDataset.description,
            category: onChainDataset.category,
            ownerAddress: onChainDataset.owner,
            price: ethers.formatEther(onChainDataset.price) + " ETH",
            format: onChainDataset.format,
            ipfsCid: onChainDataset.ipfsCid,
          };
          setDataset(formattedDataset);
        } else {
          setError("Dataset not found.");
        }
      } catch (err) {
        console.error("Failed to fetch dataset details:", err);
        setError("Failed to load dataset details. Check console.");
      } finally {
        setIsLoading(false);
      }
    };

    if (contract) {
      fetchDatasetDetails();
    }
  }, [contract, datasetId]);

  // --- Verification Logic Effect ---
  useEffect(() => {
    const checkAccess = async () => {
      if (!contract || !walletAddress || !dataset) {
        setIsCheckingAccess(false);
        return;
      }

      setIsCheckingAccess(true);

      const isOwner = dataset.ownerAddress.toLowerCase() === walletAddress.toLowerCase();
      if (isOwner) {
        setHasAccess(true);
        setIsCheckingAccess(false);
        return; 
      }

      try {
        const filter = contract.filters.DatasetPurchased(
          dataset.id,
          walletAddress
        );
        const events = await contract.queryFilter(filter);
        if (events.length > 0) {
          setHasAccess(true);
        }
      } catch (err) {
        console.error("Failed to check purchase history:", err);
      } finally {
        setIsCheckingAccess(false);
      }
    };

    checkAccess();
  }, [contract, walletAddress, dataset]);

  // --- Rendering Logic ---
  if (isLoading) {
    return <div className="text-center p-10"><LoadingSpinner /></div>;
  }
  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }
  if (!dataset) {
    return <div className="text-center p-10 text-gray-400">Dataset not found.</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-gray-100">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold">{dataset.name}</h1>
            <span className="bg-indigo-600 text-white text-sm font-medium px-3 py-1 rounded-full">{dataset.category}</span>
        </div>
        {/* Description */}
        <p className="text-gray-400 mb-6">{dataset.description}</p>

        {/* Details Section */}
        <div className="border-t border-gray-700 pt-4">
          <h3 className="text-lg font-semibold mb-3">Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 font-medium">Owner</p>
              <p className="font-mono break-all text-gray-300">{dataset.ownerAddress}</p>
            </div>
            <div>
              <p className="text-gray-500 font-medium">Price</p>
              <p className="font-semibold text-lg text-green-400">{dataset.price}</p>
            </div>
            <div>
              <p className="text-gray-500 font-medium">Format</p>
              <p className="text-gray-300">{dataset.format}</p>
            </div>
            <div>
              <p className="text-gray-500 font-medium">Dataset ID</p>
              <p className="text-gray-300">{dataset.id.toString()}</p>
            </div>
          </div>
        </div>

        {/* --- UPDATE UI --- */}
        <div className="mt-8 border-t border-gray-700 pt-6">
          {isCheckingAccess ? (
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
          ) : hasAccess ? (
            // If user has access, show Download button
            <a
              href={`https://gateway.pinata.cloud/ipfs/${dataset.ipfsCid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors text-center block"
            >
              Download Dataset
            </a>
          ) : (
            // If user does NOT have access, show Purchase button
            <button
              onClick={handlePurchase}
              disabled={isPurchasing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {isPurchasing ? "Processing..." : `Purchase Access for ${dataset.price}`}
            </button>
          )}

          {/* This shows the status (e.g., "Please connect wallet...") */}
          {purchaseStatus && !hasAccess && (
            <p className={`text-center text-sm mt-4 ${purchaseStatus.includes('failed') || purchaseStatus.includes('cancelled') ? 'text-red-400' : 'text-gray-400'}`}>
              {purchaseStatus}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DatasetDetailPage;