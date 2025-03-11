import { Paper, Dataset, Repository } from "@/types";
import { BookOpen, FileType, FolderGit2, Link, Calendar, Book, Users, Database } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import DatasetModal from "@/features/entrypoints/components/modals/DatasetModal";
import PaperModal from "@/features/entrypoints/components/modals/PaperModal";
import RepositoryModal from "@/features/entrypoints/components/modals/RepositoryModal";
import { Button } from "@/components/shadcn/button";
import { ExtendedGarden } from "@/types/garden.types";
import { BaseMaterialCard } from "./components/MaterialCard";
import { ModalFunctionWithOwner, useMaterialActions } from "./hooks/useMaterialActions";
import { EditDialog, RemoveDialog } from "./components/MaterialDialogs";

interface MaterialCardProps {
  isOwner: boolean;
  garden: ExtendedGarden;
  findAffectedFunctions?: (doi: string) => ModalFunctionWithOwner[];
  onUpdate?: () => void; // Callback to refresh the garden data
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

  // Clean up paper object to ensure compatibility with MaterialType
  const materialPaper = {
    ...paper,
    doi: paper.doi || undefined, // Convert null to undefined
    url: paper.url || undefined   // Convert null to undefined
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
    
    // Clean up the updated paper for proper typing
    const cleanUpdatedPaper = {
      ...updatedPaper,
      doi: updatedPaper.doi || undefined,
      url: updatedPaper.url || undefined,
      name: updatedPaper.title || "Untitled Paper"
    };
    
    // Show the confirmation dialog for function selection
    if (paper.doi && findAffectedFunctions) {
      await prepareFunctionsForEdit(cleanUpdatedPaper);
    } else {
      // If no DOI or findAffectedFunctions, just refresh
      if (onUpdate) {
        onUpdate();
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
        title={paper.title || "Untitled Paper"}
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
        toggleFunction={toggleFunction}
        toggleAll={toggleAll}
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
        toggleFunction={toggleFunction}
        toggleAll={toggleAll}
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
        onUpdate();
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

  // Clean up repository object to ensure compatibility with MaterialType
  const materialRepository = {
    ...repository,
    doi: typeof repository.doi === 'string' ? repository.doi : undefined,
    url: typeof repository.url === 'string' ? repository.url : undefined,
    name: typeof repository.name === 'string' ? repository.name : 
          (typeof repository.repo_name === 'string' ? repository.repo_name : "Untitled Repository"),
    description: typeof repository.description === 'string' ? repository.description : undefined
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
    material: materialRepository,
    garden,
    findAffectedFunctions,
    onUpdate,
    materialType: "repository"
  });

  const handleEdit = async (updatedRepository: Repository) => {
    setIsEditing(false);
    
    // Clean up the updated repository for proper typing
    const cleanUpdatedRepository = {
      ...updatedRepository,
      // Prioritize DOI over URL for identification
      doi: typeof updatedRepository.doi === 'string' ? updatedRepository.doi : undefined,
      url: !updatedRepository.doi && typeof updatedRepository.url === 'string' ? updatedRepository.url : undefined,
      name: typeof updatedRepository.name === 'string' ? updatedRepository.name : 
            (typeof updatedRepository.repo_name === 'string' ? updatedRepository.repo_name : "Untitled Repository"),
      description: typeof updatedRepository.description === 'string' ? updatedRepository.description : undefined
    };
    
    // Show the confirmation dialog for function selection if we can find affected functions
    const identifier = cleanUpdatedRepository.doi || cleanUpdatedRepository.url;
    if (findAffectedFunctions && identifier) {
      await prepareFunctionsForEdit(cleanUpdatedRepository);
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
        title={typeof materialRepository.name === 'string' ? materialRepository.name : "Untitled Repository"}
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
          {typeof repository.doi === 'string' && repository.doi && (
            <div className="flex items-baseline">
              <span className="w-24 text-gray-500 text-xs font-medium">DOI</span>
              <a 
                href={`https://doi.org/${repository.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-blue-600 hover:underline text-xs"
              >
                {repository.doi}
              </a>
            </div>
          )}
          
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