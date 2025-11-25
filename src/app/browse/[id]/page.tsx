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
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4">
        <div className="text-center bg-red-500/10 border border-red-500/20 rounded-2xl p-8">
          <p className="text-red-400 text-xl">{error}</p>
        </div>
      </div>
    );
  }
  if (!dataset) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4">
        <p className="text-gray-400 text-xl">Dataset not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-gray-100">
      {/* Hero Section */}
      <div className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm font-semibold px-4 py-2 rounded-full">
                  {dataset.category}
                </span>
                <span className="bg-white/5 text-gray-300 text-sm font-medium px-4 py-2 rounded-full border border-white/10">
                  {dataset.format}
                </span>
              </div>
              <h1 className="text-5xl font-bold mb-4">{dataset.name}</h1>
              <p className="text-xl text-gray-400 leading-relaxed">{dataset.description}</p>
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-6">
            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <p className="text-sm text-gray-500 font-medium mb-2">Provider Address</p>
                <p className="font-mono text-white break-all">{dataset.ownerAddress}</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <p className="text-sm text-gray-500 font-medium mb-2">Dataset ID</p>
                <p className="text-white font-semibold">#{dataset.id.toString()}</p>
              </div>
            </div>

            {/* Price Section */}
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Price</p>
                  <p className="text-4xl font-bold glow-text-purple">{dataset.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400 mb-1">Format</p>
                  <p className="text-xl font-semibold text-white">{dataset.format}</p>
                </div>
              </div>
            </div>

            {/* Action Section */}
            <div>
              {isCheckingAccess ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : hasAccess ? (
                <a
                  href={`https://gateway.pinata.cloud/ipfs/${dataset.ipfsCid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-green-500/50 transition-all duration-300 hover:scale-105 text-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Dataset
                </a>
              ) : (
                <button
                  onClick={handlePurchase}
                  disabled={isPurchasing}
                  className="w-full px-8 py-4 rounded-full font-bold bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-lg"
                >
                  {isPurchasing ? "Processing Purchase..." : `Purchase Access for ${dataset.price}`}
                </button>
              )}

              {purchaseStatus && !hasAccess && (
                <div className={`mt-4 text-center p-4 rounded-2xl ${
                  purchaseStatus.includes('failed') || purchaseStatus.includes('cancelled')
                    ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                    : purchaseStatus.includes('✅')
                    ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                    : 'bg-white/5 border border-white/10 text-gray-400'
                }`}>
                  <p className="font-medium">{purchaseStatus}</p>
                </div>
              )}
            </div>
          </div>

          {/* IPFS Info */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">IPFS Content ID</h3>
            <p className="font-mono text-sm text-gray-300 break-all">{dataset.ipfsCid}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetDetailPage;