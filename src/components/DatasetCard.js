import React from 'react';

const DatasetCard = ({ dataset }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-neutral-border">
      <h3 className="text-xl font-semibold text-primary mb-2">
        {dataset.title}
      </h3>
      <p className="text-neutral-text mb-4">
        {dataset.description}
      </p>
      <div className="flex items-center">
        <span className="text-sm text-gray-500">
          Owner: 
          <span className="font-medium text-neutral-text ml-1">
            {dataset.owner}
          </span>
        </span>
      </div>
    </div>
  );
};

export default DatasetCard;