import React, { useState } from 'react';

interface TruncatedListProps {
  items: string[];
  label: string;
  maxVisible?: number;
}

const TruncatedList = ({
  items,
  label,
  maxVisible = 5
}: TruncatedListProps) => {
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
          className="inline-flex items-center bg-teal/10 text-teal hover:bg-teal/20 text-xs px-2 py-0.5 rounded transition-colors"
        >
          {showAll ? 'Show Less' : `Show All (${hiddenCount} more)`}
        </button>
      )}
    </div>
  );
};

export default TruncatedList;