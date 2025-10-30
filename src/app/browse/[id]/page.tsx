"use client";

import { useState, useEffect, use } from 'react'; // Added 'use'
import { ethers } from 'ethers';
import { useWallet } from '@/context/WalletContext';
import { type Dataset } from '@/components/common/DatasetCard';

const DatasetDetailPage = ({ params }: { params: Promise<{ id: string }> }) => { // Updated params type
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- New State for Purchasing ---
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState("");

  const { contract, signer, connectWallet, walletAddress } = useWallet(); // Added walletAddress
  const { id: datasetId } = use(params); // Use React.use() to get ID

  // --- Fetch Dataset Details Effect (Corrected Check) ---
  useEffect(() => {
    const fetchDatasetDetails = async () => {
      // Check for valid ID early
      if (datasetId === undefined || isNaN(Number(datasetId))) {
        setIsLoading(false);
        setError("Invalid Dataset ID provided in URL.");
        return;
      }
      // Check for contract later, after ID is confirmed valid
      if (!contract) {
        // Don't set error here, maybe context is just loading
        console.log("Contract context not ready yet.");
        return;
      }

      setIsLoading(true);
      setError(null);

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
        setError("Failed to load dataset details. Check console.");
      } finally {
        setIsLoading(false);
      }
    };

    // Only run fetch if contract is available
    if (contract) {
        fetchDatasetDetails();
    }
  }, [contract, datasetId]);

  // --- New Function: handlePurchase ---
  const handlePurchase = async () => {
    if (!signer || !contract) {
      setPurchaseStatus("Please connect your wallet first.");
      // Consider calling connectWallet() automatically here if desired
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

  // --- Rendering Logic ---
  if (isLoading) {
    return <div className="text-center p-10 text-gray-400">Loading dataset details...</div>;
  }
  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }
  if (!dataset) {
    return <div className="text-center p-10 text-gray-400">Dataset not found.</div>;
  }

  const isOwner = walletAddress && dataset.ownerAddress.toLowerCase() === walletAddress.toLowerCase();

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

        {/* Purchase Button & Status */}
        <div className="mt-8 border-t border-gray-700 pt-6">
           {isOwner ? (
             <p className="text-center text-gray-400 font-medium">You are the owner of this dataset.</p>
           ) : (
             <button
               onClick={handlePurchase}
               disabled={isPurchasing}
               className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
             >
               {isPurchasing ? "Processing..." : `Purchase Access for ${dataset.price}`}
             </button>
           )}
          {purchaseStatus && (
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