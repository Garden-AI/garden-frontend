import { Paper, Dataset, Repository, Garden, ModalFunction } from "@/types";
import { BookOpen, FileType, FolderGit2, Link, Calendar, Book, Users, Database } from "lucide-react";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { DatasetModal } from "../modals/DatasetModal";
import { PaperModal } from "../modals/PaperModal";
import { RepositoryModal } from "../modals/RepositoryModal";
import { Button } from "@/components/shadcn/button";
import { Edit2, Trash2 } from "lucide-react";
import { useMaterialActions } from "../../hooks/useMaterialActions";
import { EditDialog, RemoveDialog } from "./MaterialDialogs";
import { BaseMaterialCard } from "./MaterialCard";

interface MaterialCardProps {
  isOwner: boolean;
  garden: Garden;
  findAffectedFunctions?: (doi: string) => ModalFunction[];
  onUpdate?: () => Promise<void>; // Changed to return Promise<void>
}

export const PaperCard = ({ 
  paper, 
  isOwner = false,
  garden,
  findAffectedFunctions,
  onUpdate
}: { 
  paper: Paper 
} & MaterialCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showFullAuthors, setShowFullAuthors] = useState(false);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);

  const materialPaper = useMemo(() => ({
    title: paper.title || 'Untitled Paper',
    doi: paper.doi || undefined,
    url: paper.url || undefined,
    authors: paper.authors,
    description: paper.description,
    citation: paper.citation
  }), [paper]);

  // Directly use the useMaterialActions hook in the component
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
    toggleFunction: removeToggleFunction,
    toggleAll: removeToggleAll
  } = useMaterialActions({
    material: materialPaper,
    garden,
    findAffectedFunctions,
    onUpdate,
    materialType: "paper"
  });

  const handleEditClick = async () => {
    // Programmatically click the hidden trigger button
    if (triggerButtonRef.current) {
      triggerButtonRef.current.click();
    }
  };

  const handleEdit = async (updatedPaper: Paper) => {
    setIsEditing(false);
    
    // Create a clean version of the updated paper to send to the API
    const cleanUpdatedPaper = {
      ...updatedPaper,
      title: updatedPaper.title || 'Untitled Paper',
      doi: updatedPaper.doi || undefined,
      url: updatedPaper.url || undefined,
      authors: updatedPaper.authors
    };
    
    // Show the confirmation dialog for function selection
    if (paper.doi && findAffectedFunctions) {
      await prepareFunctionsForEdit(cleanUpdatedPaper as any);
    } else {
      // If no DOI or findAffectedFunctions, just refresh
      if (onUpdate) {
        await onUpdate();
      }
    }
  };
  
  // Only show these fields if they have values
  const hasJournal = typeof paper.journal === 'string' && paper.journal.trim() !== '';
  const hasYear = typeof paper.year === 'string' || typeof paper.year === 'number';
  const hasCitation = typeof paper.citation === 'string' && paper.citation.trim() !== '';
  const hasRepository = typeof paper.repository === 'string' && paper.repository.trim() !== '';
  const hasAuthors = paper.authors && paper.authors.length > 0;
  const authorsExceedLimit = hasAuthors && paper.authors!.length > 3;
  
  return (
    <>
      <BaseMaterialCard
        material={materialPaper}
        materialType="paper"
        isOwner={isOwner}
        garden={garden}
        findAffectedFunctions={findAffectedFunctions}
        onUpdate={onUpdate}
        icon={<BookOpen className="h-4 w-4" />}
        title={materialPaper.title}
        onEdit={handleEdit}
        onEditClick={handleEditClick}
        // Pass all the necessary state and functions for edit/remove dialogs
        isSelectiveEditing={isSelectiveEditing}
        setIsSelectiveEditing={setIsSelectiveEditing}
        editAffectedFunctions={editAffectedFunctions}
        editSelectiveFunctions={editSelectiveFunctions}
        applyEditToAllFunctions={applyEditToAllFunctions}
        applySelectiveEdit={applySelectiveEdit}
        toggleEditFunction={toggleEditFunction}
        toggleEditAll={toggleEditAll}
        confirmRemove={confirmRemove}
        setConfirmRemove={setConfirmRemove}
        prepareFunctionsForRemoval={prepareFunctionsForRemoval}
        affectedFunctions={affectedFunctions}
        selectiveFunctions={selectiveFunctions}
        isSelectiveRemoval={isSelectiveRemoval}
        setIsSelectiveRemoval={setIsSelectiveRemoval}
        handleRemoveAll={handleRemoveAll}
        handleSelectiveRemove={handleSelectiveRemove}
        toggleFunction={removeToggleFunction}
        toggleAll={removeToggleAll}
      >
        <div className="space-y-2.5 py-1">
          {/* DOI */}
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
          
          {/* Authors with expand/collapse functionality */}
          {hasAuthors && (
            <div className="flex items-baseline">
              <span className="w-24 text-gray-500 text-xs font-medium">Authors</span>
              <div className="flex-1">
                <div className={showFullAuthors ? "" : "line-clamp-1"}>
                  {paper.authors!.join(", ")}
                </div>
                {authorsExceedLimit && (
                  <button 
                    onClick={() => setShowFullAuthors(!showFullAuthors)} 
                    className="text-xs text-blue-600 hover:underline mt-1 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    {showFullAuthors ? "Show less" : "Show all authors"}
                  </button>
                )}
              </div>
            </div>
          )}
          
          {/* Journal & Year in one row */}
          {(hasJournal || hasYear) && (
            <div className="flex items-baseline">
              <span className="w-24 text-gray-500 text-xs font-medium">Published</span>
              <div className="flex-1">
                {hasJournal && (
                  <span>{String(paper.journal)}</span>
                )}
                {hasJournal && hasYear && (
                  <span>, </span>
                )}
                {hasYear && (
                  <span>{String(paper.year)}</span>
                )}
              </div>
            </div>
          )}
          
          {/* Citation */}
          {hasCitation && (
            <div className="flex items-baseline">
              <span className="w-24 text-gray-500 text-xs font-medium">Citation</span>
              <div className="flex-1 text-xs line-clamp-2">{paper.citation}</div>
            </div>
          )}
          
          {/* Repository */}
          {hasRepository && (
            <div className="flex items-baseline">
              <span className="w-24 text-gray-500 text-xs font-medium">Repository</span>
              <a 
                href={typeof paper.repository === 'string' ? paper.repository : '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 text-blue-600 hover:underline text-xs"
              >
                {typeof paper.repository === 'string' ? paper.repository.replace(/^https?:\/\//, '') : ''}
              </a>
            </div>
          )}
        </div>
      </BaseMaterialCard>
      
      {/* Render the dialog components directly in PaperCard */}
      <EditDialog
        isOpen={isSelectiveEditing}
        onClose={() => setIsSelectiveEditing(false)}
        materialType="paper"
        editAffectedFunctions={editAffectedFunctions}
        editSelectiveFunctions={editSelectiveFunctions}
        toggleEditFunction={toggleEditFunction}
        toggleEditAll={toggleEditAll}
        applyEditToAllFunctions={applyEditToAllFunctions}
        applySelectiveEdit={applySelectiveEdit}
      />
      
      <RemoveDialog
        isOpen={confirmRemove}
        onClose={() => setConfirmRemove(false)}
        materialType="paper"
        affectedFunctions={affectedFunctions}
        selectiveFunctions={selectiveFunctions}
        toggleFunction={removeToggleFunction}
        toggleAll={removeToggleAll}
        handleRemoveAll={handleRemoveAll}
        handleSelectiveRemove={handleSelectiveRemove}
        isSelectiveRemoval={isSelectiveRemoval}
        setIsSelectiveRemoval={setIsSelectiveRemoval}
      />
      
      {/* Edit Paper Modal - always render it but keep the trigger hidden */}
      <PaperModal
        edit
        initialData={paper}
        onSave={handleEdit}
        trigger={<Button ref={triggerButtonRef} className="hidden">Edit</Button>}
      />
    </>
  );
};

export const DatasetCard = ({ 
  dataset, 
  isOwner = false,
  garden,
  findAffectedFunctions,
  onUpdate
}: { 
  dataset: Dataset 
} & MaterialCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);

  // Clean up dataset object to ensure compatibility with MaterialType
  const materialDataset = {
    ...dataset,
    doi: dataset.doi || undefined, // Convert null to undefined
    url: dataset.url || undefined,  // Convert null to undefined
    // Add name field if it doesn't exist
    name: dataset.title || "Untitled Dataset"
  };

  // Directly use the useMaterialActions hook in the component
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
    material: materialDataset,
    garden,
    findAffectedFunctions,
    onUpdate,
    materialType: "dataset"
  });

  const handleEditClick = async () => {
    // Programmatically click the hidden trigger button
    if (triggerButtonRef.current) {
      triggerButtonRef.current.click();
    }
  };

  const handleEdit = async (updatedDataset: Dataset) => {
    setIsEditing(false);
    
    // Clean up the updated dataset for proper typing
    const cleanUpdatedDataset = {
      ...updatedDataset,
      doi: updatedDataset.doi || undefined,
      url: updatedDataset.url || undefined,
      // Ensure the name property is included
      name: updatedDataset.title || "Untitled Dataset"
    };
    
    // Show the confirmation dialog for function selection
    if (dataset.doi && findAffectedFunctions) {
      await prepareFunctionsForEdit(cleanUpdatedDataset);
    } else {
      // If no DOI or findAffectedFunctions, just refresh
      if (onUpdate) {
        await onUpdate();
      }
    }
  };
  
  // Check if fields have valid values
  const hasDescription = typeof dataset.description === 'string' && dataset.description.trim() !== '';
  const hasDataType = typeof dataset.data_type === 'string' && dataset.data_type.trim() !== '';
  
  return (
    <>
      <BaseMaterialCard
        material={materialDataset}
        materialType="dataset"
        isOwner={isOwner}
        garden={garden}
        findAffectedFunctions={findAffectedFunctions}
        onUpdate={onUpdate}
        icon={<Database className="h-4 w-4" />}
        title={materialDataset.name}
        onEdit={handleEdit as any}
        onEditClick={handleEditClick}
        // Pass all the necessary state and functions for edit/remove dialogs
        isSelectiveEditing={isSelectiveEditing}
        setIsSelectiveEditing={setIsSelectiveEditing}
        editAffectedFunctions={editAffectedFunctions}
        editSelectiveFunctions={editSelectiveFunctions}
        applyEditToAllFunctions={applyEditToAllFunctions}
        applySelectiveEdit={applySelectiveEdit}
        toggleEditFunction={toggleEditFunction}
        toggleEditAll={toggleEditAll}
        confirmRemove={confirmRemove}
        setConfirmRemove={setConfirmRemove}
        prepareFunctionsForRemoval={prepareFunctionsForRemoval}
        affectedFunctions={affectedFunctions}
        selectiveFunctions={selectiveFunctions}
        isSelectiveRemoval={isSelectiveRemoval}
        setIsSelectiveRemoval={setIsSelectiveRemoval}
        handleRemoveAll={handleRemoveAll}
        handleSelectiveRemove={handleSelectiveRemove}
        toggleFunction={toggleFunction}
        toggleAll={toggleAll}
      >
        <div className="space-y-2.5 py-1">
          {/* DOI */}
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
          
          {/* Data Type */}
          {hasDataType && (
            <div className="flex items-baseline">
              <span className="w-24 text-gray-500 text-xs font-medium">Data Type</span>
              <span className="flex-1">{String(dataset.data_type)}</span>
            </div>
          )}
          
          {/* Description */}
          {hasDescription && (
            <div className="flex items-baseline">
              <span className="w-24 text-gray-500 text-xs font-medium">Description</span>
              <span className="flex-1 line-clamp-2">{String(dataset.description)}</span>
            </div>
          )}
          
          {/* Repository */}
          {dataset.repository && (
            <div className="flex items-baseline">
              <span className="w-24 text-gray-500 text-xs font-medium">Repository</span>
              {dataset.repository.startsWith('http://') || dataset.repository.startsWith('https://') ? (
                <a 
                  href={dataset.repository} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 text-blue-600 hover:underline text-xs"
                >
                  {dataset.repository.replace(/^https?:\/\//, '')}
                </a>
              ) : dataset.repository.includes('github.com/') ? (
                <a 
                  href={`https://${dataset.repository}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 text-blue-600 hover:underline text-xs"
                >
                  {dataset.repository}
                </a>
              ) : dataset.repository.includes('/') ? (
                <a 
                  href={`https://github.com/${dataset.repository}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 text-blue-600 hover:underline text-xs"
                >
                  {dataset.repository}
                </a>
              ) : (
                <span className="flex-1 text-xs">{dataset.repository}</span>
              )}
            </div>
          )}
        </div>
      </BaseMaterialCard>
      
      {/* Render the dialog components directly in DatasetCard */}
      <EditDialog
        isOpen={isSelectiveEditing}
        onClose={() => setIsSelectiveEditing(false)}
        materialType="dataset"
        editAffectedFunctions={editAffectedFunctions}
        editSelectiveFunctions={editSelectiveFunctions}
        toggleEditFunction={toggleEditFunction}
        toggleEditAll={toggleEditAll}
        applyEditToAllFunctions={applyEditToAllFunctions}
        applySelectiveEdit={applySelectiveEdit}
      />
      
      <RemoveDialog
        isOpen={confirmRemove}
        onClose={() => setConfirmRemove(false)}
        materialType="dataset"
        affectedFunctions={affectedFunctions}
        selectiveFunctions={selectiveFunctions}
        toggleFunction={toggleFunction}
        toggleAll={toggleAll}
        handleRemoveAll={handleRemoveAll}
        handleSelectiveRemove={handleSelectiveRemove}
        isSelectiveRemoval={isSelectiveRemoval}
        setIsSelectiveRemoval={setIsSelectiveRemoval}
      />
      
      {/* Edit Dataset Modal - always render it but keep the trigger hidden */}
      <DatasetModal
        edit
        initialData={dataset}
        onSave={handleEdit}
        trigger={<Button ref={triggerButtonRef} className="hidden">Edit</Button>}
      />
    </>
  );
};

export const RepositoryCard = ({ 
  repository, 
  isOwner = false,
  garden,
  findAffectedFunctions,
  onUpdate
}: { 
  repository: Repository 
} & MaterialCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showFullContributors, setShowFullContributors] = useState(false);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);

  const materialRepository = useMemo(() => ({
    ...repository,
    title: repository.repo_name,
    url: repository.url
  }), [repository]);

  // Directly use the useMaterialActions hook in the component
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
    material: materialRepository,
    garden,
    findAffectedFunctions,
    onUpdate,
    materialType: "repository"
  });

  const handleEdit = async (updatedRepository: Repository) => {
    setIsEditing(false);
    
    // Create a clean version of the updated repository
    const cleanUpdatedRepository = {
      ...updatedRepository,
      title: updatedRepository.repo_name || 'Untitled Repository',
      url: updatedRepository.url || undefined,
      repo_name: updatedRepository.repo_name
    };

    const identifier = cleanUpdatedRepository.url;
    if (findAffectedFunctions && identifier) {
      await prepareFunctionsForEdit(cleanUpdatedRepository as any);
    } else {
      // If no identifier or findAffectedFunctions, just refresh
      if (onUpdate) {
        await onUpdate();
      }
    }
  };

  const handleEditClick = async () => {
    // Programmatically click the hidden trigger button
    if (triggerButtonRef.current) {
      triggerButtonRef.current.click();
    }
  };
  
  const hasContributors = repository.contributors && Array.isArray(repository.contributors) && repository.contributors.length > 0;
  const contributorsExceedLimit = hasContributors && repository.contributors!.length > 3;
  
  return (
    <>
      <BaseMaterialCard
        material={materialRepository}
        materialType="repository"
        isOwner={isOwner}
        garden={garden}
        findAffectedFunctions={findAffectedFunctions}
        onUpdate={onUpdate}
        icon={<FolderGit2 className="h-4 w-4" />}
        title={materialRepository.title}
        onEdit={handleEdit as any}
        onEditClick={handleEditClick}
        // Pass all the necessary state and functions for edit/remove dialogs
        isSelectiveEditing={isSelectiveEditing}
        setIsSelectiveEditing={setIsSelectiveEditing}
        editAffectedFunctions={editAffectedFunctions}
        editSelectiveFunctions={editSelectiveFunctions}
        applyEditToAllFunctions={applyEditToAllFunctions}
        applySelectiveEdit={applySelectiveEdit}
        toggleEditFunction={toggleEditFunction}
        toggleEditAll={toggleEditAll}
        confirmRemove={confirmRemove}
        setConfirmRemove={setConfirmRemove}
        prepareFunctionsForRemoval={prepareFunctionsForRemoval}
        affectedFunctions={affectedFunctions}
        selectiveFunctions={selectiveFunctions}
        isSelectiveRemoval={isSelectiveRemoval}
        setIsSelectiveRemoval={setIsSelectiveRemoval}
        handleRemoveAll={handleRemoveAll}
        handleSelectiveRemove={handleSelectiveRemove}
        toggleFunction={toggleFunction}
        toggleAll={toggleAll}
      >
        <div className="space-y-2.5 py-1">
          {/* URL */}
          {typeof repository.url === 'string' && repository.url && (
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
          
          {/* Description */}
          {typeof repository.description === 'string' && repository.description && (
            <div className="flex items-baseline">
              <span className="w-24 text-gray-500 text-xs font-medium">Description</span>
              <div className="flex-1 line-clamp-2">{repository.description}</div>
            </div>
          )}
          
          {/* Contributors with expand/collapse functionality */}
          {hasContributors && (
            <div className="flex items-baseline">
              <span className="w-24 text-gray-500 text-xs font-medium">Contributors</span>
              <div className="flex-1">
                <div className={showFullContributors ? "" : "line-clamp-1"}>
                  {repository.contributors!.join(", ")}
                </div>
                {contributorsExceedLimit && (
                  <button 
                    onClick={() => setShowFullContributors(!showFullContributors)} 
                    className="text-xs text-blue-600 hover:underline mt-1 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    {showFullContributors ? "Show less" : "Show all contributors"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </BaseMaterialCard>
      
      {/* Render the dialog components directly in RepositoryCard */}
      <EditDialog
        isOpen={isSelectiveEditing}
        onClose={() => setIsSelectiveEditing(false)}
        materialType="repository"
        editAffectedFunctions={editAffectedFunctions}
        editSelectiveFunctions={editSelectiveFunctions}
        toggleEditFunction={toggleEditFunction}
        toggleEditAll={toggleEditAll}
        applyEditToAllFunctions={applyEditToAllFunctions}
        applySelectiveEdit={applySelectiveEdit}
      />
      
      <RemoveDialog
        isOpen={confirmRemove}
        onClose={() => setConfirmRemove(false)}
        materialType="repository"
        affectedFunctions={affectedFunctions}
        selectiveFunctions={selectiveFunctions}
        toggleFunction={toggleFunction}
        toggleAll={toggleAll}
        handleRemoveAll={handleRemoveAll}
        handleSelectiveRemove={handleSelectiveRemove}
        isSelectiveRemoval={isSelectiveRemoval}
        setIsSelectiveRemoval={setIsSelectiveRemoval}
      />
      
      {/* Edit Repository Modal - always render it but keep the trigger hidden */}
      <RepositoryModal
        edit
        initialData={repository}
        onSave={handleEdit}
        trigger={<Button ref={triggerButtonRef} className="hidden">Edit</Button>}
      />
    </>
  );
}; 