import React, { useState, useRef } from 'react';
import { Paper, ModalFunction } from "@/types";
import { BookOpen } from "lucide-react";
import { PaperModal } from "../modals/PaperModal";
import { Button } from "@/components/shadcn/button";
import { BaseMaterialCard } from "./MaterialCard";
import { MaterialContext } from "./MaterialCards";

interface PaperCardProps {
  paper: Paper;
  isOwner: boolean;
  context: MaterialContext;
  onUpdate: (data: Paper) => Promise<void>;
  onDelete: () => void;
  index?: number;
}

export const PaperCard: React.FC<PaperCardProps> = ({ 
  paper, 
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

  const handleEdit = async (updatedPaper: Paper) => {
    setIsEditing(false);
    await onUpdate(updatedPaper);
  };

  return (
    <>
      <BaseMaterialCard
        material={paper}
        materialType="paper"
        isOwner={isOwner}
        context={context}
        icon={<BookOpen className="h-4 w-4" />}
        title={paper.title || "Untitled Paper"}
        onEdit={onDelete}
        onEditClick={handleEditClick}
      >
        <div className="space-y-2.5 py-1">
          {paper.doi && (
            <div className="flex items-baseline">
              <span className="w-24 text-gray-500 text-xs font-medium">DOI</span>
              <a 
                href={`https://doi.org/${paper.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-blue-600 hover:underline text-xs"
              >
                {paper.doi}
              </a>
            </div>
          )}
          
          {paper.authors && paper.authors.length > 0 && (
            <div className="flex items-baseline">
              <span className="w-24 text-gray-500 text-xs font-medium">Authors</span>
              <div className="flex-1 line-clamp-2">
                {paper.authors.join(", ")}
              </div>
            </div>
          )}
          
          {paper.citation && (
            <div className="flex items-baseline">
              <span className="w-24 text-gray-500 text-xs font-medium">Citation</span>
              <div className="flex-1 line-clamp-2">{paper.citation}</div>
            </div>
          )}
        </div>
      </BaseMaterialCard>
      
      <PaperModal
        edit
        initialData={paper}
        onSave={handleEdit}
        trigger={<Button ref={triggerButtonRef} className="hidden">Edit</Button>}
      />
    </>
  );
}; 