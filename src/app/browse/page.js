// src/app/browse/page.js
import DatasetCard from '../components/DatasetCard';
import React from 'react';

// This is an example of what your data might look like
// In a real app, this would likely come from an API call
const datasets = [
  { id: 1, title: 'Climate Change Data', description: 'A comprehensive dataset on global climate trends.', owner: 'John Doe' },
  { id: 2, title: 'Urban Population Stats', description: 'Statistics on city populations worldwide.', owner: 'Jane Smith' },
  { id: 3, title: 'E-commerce Sales Figures', description: 'Quarterly sales data from a major online retailer.', owner: 'Acme Inc.' },
];

const BrowsePage = () => {
  return (
    <div>
      <h1>Browse Datasets</h1>
      {datasets.map((dataset) => (
        <DatasetCard key={dataset.id} dataset={dataset} />
      ))}
    </div>
  );
};

export default BrowsePage;