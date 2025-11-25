"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWallet } from "@/context/WalletContext";
import DatasetCard, { type Dataset } from "@/components/common/DatasetCard";
import Link from "next/link";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Plus, Search, Filter } from 'lucide-react';

const BrowsePage = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { contract } = useWallet();

  useEffect(() => {
    const fetchDatasets = async () => {
      if (!contract) return;

      try {
        const onChainDatasets = await contract.getAllDatasets();

        const formattedDatasets = onChainDatasets.map(
          (dataset: any, index: number) => ({
            id: Number(dataset.id),
            name: dataset.name,
            description: dataset.description,
            category: dataset.category,
            ownerAddress: dataset.owner,
            price: ethers.formatEther(dataset.price) + " ETH",
            format: dataset.format,
          })
        );

        setDatasets(formattedDatasets);
      } catch (err) {
        console.error("Failed to fetch datasets:", err);
        setError("Failed to load datasets. Please check the console for details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDatasets();
  }, [contract]);

  const categories = ["All", ...new Set(datasets.map(d => d.category))];

  const filteredDatasets = datasets.filter(dataset => {
    const matchesSearch = dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dataset.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || dataset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-gray-100">
      {/* Hero Section */}
      <div className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-5xl font-bold mb-3">
                Explore <span className="glow-text-purple">Datasets</span>
              </h1>
              <p className="text-xl text-gray-400">
                Discover verified data from trusted providers
              </p>
            </div>

            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              <span>Upload Dataset</span>
            </Link>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search datasets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-12 pr-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat} className="bg-gray-900">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {isLoading && <LoadingSpinner />}

        {error && (
          <div className="text-center py-12">
            <div className="inline-block px-6 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
              <p className="text-red-400">{error}</p>
            </div>
          </div>
        )}

        {!isLoading && !error && filteredDatasets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">
              {datasets.length === 0
                ? "No datasets have been created yet."
                : "No datasets match your search."}
            </p>
          </div>
        )}

        {!isLoading && !error && filteredDatasets.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDatasets.map((dataset) => (
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