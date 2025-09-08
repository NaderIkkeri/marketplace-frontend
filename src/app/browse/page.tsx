// src/app/browse/page.tsx
import React from 'react';
// Correctly import the component and the type definition from the same file
import DatasetCard, { type Dataset } from '@/components/common/DatasetCard';
import Link from 'next/link';

// --- MOCK DATA ---
// This data now perfectly matches the structure required by the DatasetCard component.
const datasets: Dataset[] = [
  { 
    id: 1, 
    name: 'Global Climate Indicators', 
    description: 'A dataset tracking key climate trends, temperature anomalies, and CO2 levels from 1958 to present.', 
    category: 'Environment',
    ownerAddress: '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2',
    price: '0.1 ETH',
    format: 'CSV'
  },
  { 
    id: 2, 
    name: 'E-commerce Customer Behavior', 
    description: 'Anonymized user interaction and purchase data from a major online retailer, perfect for market basket analysis.', 
    category: 'Retail',
    ownerAddress: '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db',
    price: '0.5 ETH',
    format: 'Parquet'
  },
  { 
    id: 3, 
    name: 'Urban Population Statistics', 
    description: 'Detailed statistics on population density, public transport, and green spaces for over 500 major cities worldwide.',
    category: 'Demographics',
    ownerAddress: '0x78731D3Ca6b7E34aC0F824c42a7cc18A495cabaB',
    price: '0.2 ETH',
    format: 'JSON'
  },
];


// --- THE PAGE COMPONENT ---
const BrowsePage: React.FC = () => {
  return (
    <div className="bg-gray-900 min-h-screen text-gray-100 p-4 sm:p-6 lg:p-8">
       <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Browse Datasets</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {datasets.map((dataset) => (
            <DatasetCard key={dataset.id} dataset={dataset} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrowsePage;
