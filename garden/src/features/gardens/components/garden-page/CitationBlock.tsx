import React from "react";
import { Garden } from "@/types";

interface CitationBlockProps {
  garden: Garden;
}

const CitationBlock = ({ garden }: CitationBlockProps) => {
  // Format citation as separate fields for better readability
  const citationId = garden.doi.split('/').pop();
  const authors = garden.authors ? garden.authors.join(', ') : 'Authors not specified';
  const title = garden.title;
  const year = garden.year || 'n.d.';
  const publisher = 'Garden AI';
  const doi = garden.doi;
  
  return (
    <div className="space-y-2">
      <div className="p-3 bg-white border border-gray-200 rounded-md font-mono text-xs overflow-auto whitespace-pre-wrap">
        <div className="flex">
          <div className="text-gray-500 w-20 flex-shrink-0">@software</div>
          <div>{`{${citationId},`}</div>
        </div>
        <div className="flex">
          <div className="text-gray-500 w-20 flex-shrink-0 pl-4">author</div>
          <div>{` = {${authors}},`}</div>
        </div>
        <div className="flex">
          <div className="text-gray-500 w-20 flex-shrink-0 pl-4">title</div>
          <div>{` = {${title}},`}</div>
        </div>
        <div className="flex">
          <div className="text-gray-500 w-20 flex-shrink-0 pl-4">year</div>
          <div>{` = {${year}},`}</div>
        </div>
        <div className="flex">
          <div className="text-gray-500 w-20 flex-shrink-0 pl-4">publisher</div>
          <div>{` = {${publisher}},`}</div>
        </div>
        <div className="flex">
          <div className="text-gray-500 w-20 flex-shrink-0 pl-4">doi</div>
          <div>{` = {${doi}}`}</div>
        </div>
        <div>{`}`}</div>
      </div>
    </div>
  );
};

export default CitationBlock; 