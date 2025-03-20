import React, { useState, useRef } from 'react';
import { Notebook, ModalFunction } from "@/types";
import { Book } from "lucide-react";
import NotebookModal from "@/features/entrypoints/components/modals/NotebookModal";
import { Button } from "@/components/shadcn/button";
import { BaseMaterialCard } from "./MaterialCard";
import { MaterialContext } from "./MaterialCards";

interface NotebookCardProps {
  notebook: Notebook;
  isOwner: boolean;
  context: MaterialContext;
  onUpdate: (data: Notebook) => Promise<void>;
  onDelete: () => void;
  index?: number;
}

export const NotebookCard: React.FC<NotebookCardProps> = ({
  notebook, 
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

  const handleEdit = async (updatedNotebook: Notebook) => {
    setIsEditing(false);
    await onUpdate(updatedNotebook);
  };

  return (
    <>
      <BaseMaterialCard
        material={notebook}
        materialType="notebook"
        isOwner={isOwner}
        context={context}
        icon={<Book className="h-4 w-4" />}
        title={notebook.title || "Untitled Notebook"}
        onEdit={onDelete}
        onEditClick={handleEditClick}
      >
        <div className="space-y-2.5 py-1">
          {notebook.description ? (
            typeof notebook.description === 'string' && (
              <div className="flex items-baseline">
                <span className="w-24 text-gray-500 text-xs font-medium">Description</span>
                <div className="flex-1 line-clamp-2">{notebook.description}</div>
              </div>
            )
          ) : null}
          
          {notebook.url && (
            <div className="flex items-baseline">
              <span className="w-24 text-gray-500 text-xs font-medium">URL</span>
              <a 
                href={notebook.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-blue-600 hover:underline text-xs"
              >
                {notebook.url.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          
          {notebook.type && (
            <div className="flex items-baseline">
              <span className="w-24 text-gray-500 text-xs font-medium">Type</span>
              <div className="flex-1 capitalize">{notebook.type}</div>
            </div>
          )}
        </div>
      </BaseMaterialCard>
      
      <NotebookModal
        edit
        initialData={notebook}
        onSave={handleEdit}
        trigger={<Button ref={triggerButtonRef} className="hidden">Edit</Button>}
      />
    </>
  );
}; 