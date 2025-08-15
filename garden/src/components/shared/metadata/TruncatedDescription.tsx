import React from "react";
import { useState } from "react";
import Markdown from "@/components/Markdown";

interface TruncatedDescriptionProps {
  content: string;
  maxLength?: number;
}

const TruncatedDescription = ({ content, maxLength = 500 }: TruncatedDescriptionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!content) return null;

  const shouldTruncate = content.length > maxLength;
  const displayContent = shouldTruncate && !isExpanded
    ? content.slice(0, maxLength) + '...'
    : content;

  return (
    <div className="prose prose-sm max-w-none prose-p:text-gray-700 prose-headings:text-gray-800">
      <Markdown content={displayContent} />
      {shouldTruncate && (
        <div className="flex justify-end">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default TruncatedDescription;