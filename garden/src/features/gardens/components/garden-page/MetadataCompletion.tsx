import React from "react";
import { Garden } from "@/types";

// Calculate metadata completion percentage and items needing attention
export const calculateMetadataCompletion = (
  garden: Garden
): { 
  percentage: number; 
  incompleteFields: string[];
} => {
  const fieldStatuses: { [key: string]: boolean } = {
    title: !!garden.title,
    authors: !!garden.authors && garden.authors.length > 0,
    description: !!garden.description && garden.description.length >= 10,
    year: !!garden.year,
    version: !!garden.version,
    tags: !!garden.tags && garden.tags.length > 0,
  };
  
  const totalFields = Object.keys(fieldStatuses).length;
  const completeFields = Object.values(fieldStatuses).filter(Boolean).length;
  
  const incompleteFields = Object.entries(fieldStatuses)
    .filter(([_, isComplete]) => !isComplete)
    .map(([fieldName, _]) => fieldName);
    
  const percentage = Math.round((completeFields / totalFields) * 100);
  
  return { percentage, incompleteFields };
};

export interface MetadataCompletionProps {
  garden: Garden;
  ownsThisGarden: boolean;
}

const MetadataCompletion = ({ garden, ownsThisGarden }: MetadataCompletionProps) => {
  const { percentage, incompleteFields } = calculateMetadataCompletion(garden);
  
  if (!ownsThisGarden || percentage === 100) {
    return null;
  }
  
  const fieldLabels: { [key: string]: string } = {
    title: "Title",
    authors: "Authors",
    description: "Description",
    year: "Year",
    version: "Version",
    tags: "Tags",
  };
  
  return (
    <div className="mb-2">
      <div className="bg-white p-2 rounded-md border text-sm">
        <div className="flex items-center justify-between mb-1">
          <p className="font-medium text-sm">Metadata Completion: {percentage}%</p>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${percentage < 50 ? 'bg-red-500' : percentage < 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        
        {incompleteFields.length > 0 && (
          <div className="mt-2 text-xs text-gray-600">
            <p>Missing: {incompleteFields.map(field => fieldLabels[field]).join(', ')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetadataCompletion; 