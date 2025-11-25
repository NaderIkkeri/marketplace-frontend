import React from 'react';
import { TrendingUp, Database } from 'lucide-react';

export type Dataset = {
  id: number;
  name: string;
  description: string;
  category: string;
  ownerAddress: string;
  price: string;
  format: string;
};

type DatasetCardProps = {
  dataset: Dataset;
};

const truncateAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(address.length - 4)}`;
};

const DatasetCard: React.FC<DatasetCardProps> = ({ dataset }) => {
  return (
    <div className="group relative bg-gradient-to-br from-white/[0.07] to-white/[0.03] border border-white/10 rounded-3xl overflow-hidden card-hover cursor-pointer">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-pink-500/0 to-purple-500/0 group-hover:from-purple-500/10 group-hover:via-pink-500/5 group-hover:to-purple-500/10 transition-all duration-500 pointer-events-none"></div>

      {/* Shine Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </div>

      <div className="relative p-6 flex flex-col h-full">
        {/* Header with Category Badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
              <Database className="w-5 h-5 text-purple-300" />
            </div>
            <span className="bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold px-3 py-1.5 rounded-full">
              {dataset.category}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300 mb-3 leading-tight">
          {dataset.name}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-sm line-clamp-2 mb-6 flex-grow leading-relaxed">
          {dataset.description}
        </p>

        {/* Stats Row */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 bg-white/5 rounded-xl px-3 py-2 border border-white/10">
            <div className="text-xs text-gray-500 mb-0.5">Format</div>
            <div className="text-sm font-semibold text-white">{dataset.format}</div>
          </div>
          <div className="flex-1 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl px-3 py-2 border border-purple-500/20">
            <div className="text-xs text-purple-300 mb-0.5 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Price
            </div>
            <div className="text-sm font-bold text-white">{dataset.price}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1">Provider</span>
            <span className="font-mono text-xs text-gray-300">{truncateAddress(dataset.ownerAddress)}</span>
          </div>
          <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300 group-hover:bg-purple-500/20 group-hover:border-purple-500/30 group-hover:text-purple-300 transition-all duration-300">
            View Details
          </div>
        </div>
      </div>

      {/* Corner Accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  );
};

export default DatasetCard;
