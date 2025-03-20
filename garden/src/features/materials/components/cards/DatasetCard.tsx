import React, { useState, useRef } from 'react';
import { Dataset, ModalFunction } from "@/types";
import { Database } from "lucide-react";
import { DatasetModal } from "../modals/DatasetModal";
import { Button } from "@/components/shadcn/button";
import { BaseMaterialCard } from "./MaterialCard";
import { MaterialContext } from "./MaterialCards";

interface DatasetCardProps {
  dataset: Dataset;
  isOwner: boolean;
  context: MaterialContext;
  onUpdate: (data: Dataset) => Promise<void>;
  onDelete: () => void;
  index?: number;
}

export const DatasetCard: React.FC<DatasetCardProps> = ({ 
  dataset, 
  isOwner = false,
  context,
  onUpdate,
  onDelete,
  index,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);

  const handleEditClick = () => {
    if (triggerButtonRef.current) {
      triggerButtonRef.current.click();
    }
  };

  const handleEdit = async (updatedDataset: Dataset) => {
    setIsEditing(false);
    await onUpdate(updatedDataset);
  };

  return (
    <>
      <BaseMaterialCard
        material={dataset}
        materialType="dataset"
        isOwner={isOwner}
        context={context}
        icon={<Database className="h-4 w-4" />}
        title={dataset.title || "Untitled Dataset"}
        onEdit={onDelete}
        onEditClick={handleEditClick}
      >
        <div className="space-y-2.5 py-1">
          {dataset.doi && (
            <div className="flex items-baseline">
              <span className="w-24 text-gray-500 text-xs font-medium">DOI</span>
              <a 
                href={`https://doi.org/${dataset.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-blue-600 hover:underline text-xs"
              >
                {dataset.doi}
              </a>
            </div>
          )}
          
          {dataset.data_type && (
            <div className="flex items-baseline">
              <span className="w-24 text-gray-500 text-xs font-medium">Data Type</span>
              <span className="flex-1">{dataset.data_type}</span>
            </div>
          )}
          
          {dataset.description ? (
            typeof dataset.description === 'string' && (
              <div className="flex items-baseline">
                <span className="w-24 text-gray-500 text-xs font-medium">Description</span>
                <div className="flex-1 line-clamp-2">{dataset.description}</div>
              </div>
            )
          ) : null}
        </div>
      </BaseMaterialCard>
      
      <DatasetModal
        edit
        initialData={dataset}
        onSave={handleEdit}
        trigger={<Button ref={triggerButtonRef} className="hidden">Edit</Button>}
      />
    </>
  );
}; 