// src/components/common/DatasetCard.tsx
import React from 'react';

// --- TYPESCRIPT DEFINITIONS ---
// This defines the data structure the card component will accept.
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

// --- HELPER FUNCTION ---
// A small utility to truncate wallet addresses for better display.
const truncateAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(address.length - 4)}`;
};

// --- THE COMPONENT ---
const DatasetCard: React.FC<DatasetCardProps> = ({ dataset }) => {
  return (
    <div className="
      group
      bg-gray-800
      border border-gray-700
      rounded-lg
      p-5
      flex flex-col
      h-full
      transition-all duration-300
      hover:border-indigo-500
      hover:shadow-lg hover:shadow-indigo-900/40
      hover:-translate-y-1
    ">
      {/* Card Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-gray-100 group-hover:text-indigo-400 transition-colors">
          {dataset.name}
        </h3>
        <span className="bg-indigo-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          {dataset.category}
        </span>
      </div>

      {/* Card Body */}
      <p className="text-gray-400 text-sm flex-grow mb-4">
        {dataset.description}
      </p>

      {/* Card Footer */}
      <div className="mt-auto border-t border-gray-700 pt-4 flex justify-between items-center text-sm">
        <div className="flex flex-col">
           <span className="text-gray-500 text-xs mb-1">Owner</span>
           <span className="font-mono text-gray-400">{truncateAddress(dataset.ownerAddress)}</span>
        </div>
        <div className="text-right">
          <span className="bg-gray-700 text-gray-300 text-xs font-medium px-2 py-1 rounded-md mr-2">{dataset.format}</span>
          <span className="font-semibold text-gray-200">{dataset.price}</span>
        </div>
      </div>
    </div>
  );
};

export default DatasetCard;
