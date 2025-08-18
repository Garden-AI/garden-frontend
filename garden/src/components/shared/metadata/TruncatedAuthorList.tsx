import React, { useState } from 'react';

interface TruncatedAuthorListProps {
  items: string[];
  label: string;
  maxVisible?: number;
}

const TruncatedAuthorList = ({ 
  items, 
  label, 
  maxVisible = 5 
}: TruncatedAuthorListProps) => {
  const [showAll, setShowAll] = useState(false);
  
  if (!items || items.length === 0) {
    return (
      <p className="text-gray-400 italic text-sm">No {label.toLowerCase()} added</p>
    );
  }

  const shouldTruncate = items.length > maxVisible;
  const displayItems = shouldTruncate && !showAll ? items.slice(0, maxVisible) : items;
  const hiddenCount = items.length - maxVisible;

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {displayItems.map((item, index) => (
        <span
          key={index}
          className="inline-flex items-center bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded"
        >
          {item}
        </span>
      ))}
      
      {shouldTruncate && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="inline-flex items-center bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs px-2 py-0.5 rounded transition-colors"
        >
          {showAll ? 'Show Less' : `Show All (${hiddenCount} more)`}
        </button>
      )}
    </div>
  );
};

export default TruncatedAuthorList;