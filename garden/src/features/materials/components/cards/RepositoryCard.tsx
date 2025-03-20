import React, { useState, useRef } from 'react';
import { Repository, ModalFunction } from "@/types";
import { FolderGit2 } from "lucide-react";
import { RepositoryModal } from "../modals/RepositoryModal";
import { Button } from "@/components/shadcn/button";
import { BaseMaterialCard } from "./MaterialCard";
import { MaterialContext } from "./MaterialCards";

interface RepositoryCardProps {
  repository: Repository;
  isOwner: boolean;
  context: MaterialContext;
  onUpdate: (data: Repository) => Promise<void>;
  onDelete: () => void;
  index?: number;
}

export const RepositoryCard: React.FC<RepositoryCardProps> = ({ 
  repository, 
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

  const handleEdit = async (updatedRepository: Repository) => {
    setIsEditing(false);
    await onUpdate(updatedRepository);
  };

  return (
    <>
      <BaseMaterialCard
        material={repository}
        materialType="repository"
        isOwner={isOwner}
        context={context}
        icon={<FolderGit2 className="h-4 w-4" />}
        title={repository.repo_name || "Untitled Repository"}
        onEdit={onDelete}
        onEditClick={handleEditClick}
      >
        <div className="space-y-2.5 py-1">
          {repository.url && (
            <div className="flex items-baseline">
              <span className="w-24 text-gray-500 text-xs font-medium">URL</span>
              <a 
                href={repository.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-blue-600 hover:underline text-xs"
              >
                {repository.url.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          
          {repository.license ? (
            typeof repository.license === 'string' && (
              <div className="flex items-baseline">
                <span className="w-24 text-gray-500 text-xs font-medium">License</span>
                <span className="flex-1">{repository.license}</span>
              </div>
            )
          ) : null}
          
          {repository.description ? (
            typeof repository.description === 'string' && (
              <div className="flex items-baseline">
                <span className="w-24 text-gray-500 text-xs font-medium">Description</span>
                <div className="flex-1 line-clamp-2">{repository.description}</div>
              </div>
            )
          ) : null}
          
          {repository.contributors && repository.contributors.length > 0 && (
            <div className="flex items-baseline">
              <span className="w-24 text-gray-500 text-xs font-medium">Contributors</span>
              <div className="flex-1 line-clamp-2">
                {repository.contributors.join(", ")}
              </div>
            </div>
          )}
        </div>
      </BaseMaterialCard>
      
      <RepositoryModal
        edit
        initialData={repository}
        onSave={handleEdit}
        trigger={<Button ref={triggerButtonRef} className="hidden">Edit</Button>}
      />
    </>
  );
}; 