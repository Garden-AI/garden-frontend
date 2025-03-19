import React from 'react';
import { Notebook, Garden, ModalFunction } from "@/types";
import { BookOpen, FileType, Link, Book, Laptop } from "lucide-react";
import { useState, useRef } from "react";
import NotebookModal from "@/features/entrypoints/components/modals/NotebookModal";
import { Button } from "@/components/shadcn/button";
import { Edit2, Trash2 } from "lucide-react";
import { useMaterialActions } from "../../hooks/useMaterialActions";
import { EditDialog, RemoveDialog } from "./MaterialDialogs";
import { BaseMaterialCard } from "./MaterialCard";

interface NotebookCardProps {
  notebook: Notebook;
  isOwner: boolean;
  garden: Garden;
  findAffectedFunctions?: (doi: string) => ModalFunction[];
  onUpdate?: () => Promise<void>;
}

export const NotebookCard: React.FC<NotebookCardProps> = ({
  notebook,
  isOwner = false,
  garden,
  findAffectedFunctions,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);

  const notebookIcon = <Book className="h-5 w-5 text-green" />;

  // Ensure notebook has all required fields
  if (!notebook || !notebook.title || !notebook.url) {
    console.error('Invalid notebook data:', notebook);
    return null;
  }

  // Clean up notebook object to ensure compatibility with MaterialType
  const materialNotebook = {
    ...notebook,
    name: notebook.title || "Untitled Notebook",
    // Ensure URL is used as the identifier
    url: notebook.url
  };

  // Use material actions hook for edit/remove functionality
  const {
    isSelectiveEditing,
    setIsSelectiveEditing,
    editAffectedFunctions,
    editSelectiveFunctions,
    prepareFunctionsForEdit,
    applyEditToAllFunctions,
    applySelectiveEdit,
    toggleEditFunction,
    toggleEditAll,
    // Also include removal functions
    confirmRemove,
    setConfirmRemove,
    prepareFunctionsForRemoval,
    affectedFunctions,
    selectiveFunctions,
    isSelectiveRemoval,
    setIsSelectiveRemoval,
    handleRemoveAll,
    handleSelectiveRemove,
    toggleFunction,
    toggleAll
  } = useMaterialActions({
    material: materialNotebook,
    garden,
    findAffectedFunctions,
    onUpdate,
    materialType: "notebook"
  });

  const handleEditClick = () => {
    // Programmatically click the hidden trigger button
    if (triggerButtonRef.current) {
      triggerButtonRef.current.click();
    }
  };

  const handleEdit = async (updatedNotebook: Notebook) => {
    setIsEditing(false);
    
    // Clean up the updated notebook for proper typing
    const cleanUpdatedNotebook = {
      ...updatedNotebook,
      name: updatedNotebook.title || "Untitled Notebook",
      // Ensure URL is used as the identifier
      url: updatedNotebook.url
    };
    
    // Show the confirmation dialog for function selection
    if (notebook.url && findAffectedFunctions) {
      await prepareFunctionsForEdit(cleanUpdatedNotebook);
    } else {
      // If no URL or findAffectedFunctions, just refresh
      if (onUpdate) {
        await onUpdate();
      }
    }
  };

  const handleRemoveClick = async () => {
    // Reset all state before starting removal process
    setConfirmRemove(false);
    setIsSelectiveRemoval(false);
    
    // Start the removal process
    await prepareFunctionsForRemoval();
  };

  return (
    <>
      <BaseMaterialCard
        material={materialNotebook}
        materialType="notebook"
        title={notebook.title}
        icon={notebookIcon}
        isOwner={isOwner}
        context={{
          parentFunction: {} as ModalFunction
        }}
        onEditClick={handleEditClick}
        onEdit={() => handleEdit}
      >
        {notebook.description && (
          <div className="mt-2 text-sm text-gray-600">
            <p>{notebook.description}</p>
          </div>
        )}
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
          <a 
            href={notebook.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline truncate"
          >
            {notebook.url}
          </a>
        </div>
      </BaseMaterialCard>

      {/* Edit Dialog */}
      <EditDialog
        isOpen={isSelectiveEditing}
        onClose={() => setIsSelectiveEditing(false)}
        materialType="notebook"
        editAffectedFunctions={editAffectedFunctions}
        editSelectiveFunctions={editSelectiveFunctions}
        toggleEditFunction={toggleEditFunction}
        toggleEditAll={toggleEditAll}
        applyEditToAllFunctions={applyEditToAllFunctions}
        applySelectiveEdit={applySelectiveEdit}
      />

      {/* Remove Dialog */}
      <RemoveDialog
        isOpen={confirmRemove}
        onClose={() => setConfirmRemove(false)}
        materialType="notebook"
        affectedFunctions={affectedFunctions}
        selectiveFunctions={selectiveFunctions}
        toggleFunction={toggleFunction}
        toggleAll={toggleAll}
        handleRemoveAll={handleRemoveAll}
        handleSelectiveRemove={handleSelectiveRemove}
        isSelectiveRemoval={isSelectiveRemoval}
        setIsSelectiveRemoval={setIsSelectiveRemoval}
      />

      {/* Edit Notebook Modal - always render it but keep the trigger hidden */}
      <NotebookModal
        edit
        initialData={notebook}
        onSave={handleEdit}
        trigger={<Button ref={triggerButtonRef} className="hidden">Edit</Button>}
      />
    </>
  );
}; 