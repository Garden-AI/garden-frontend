import { Paper, Dataset, Repository, Notebook } from "@/types";
import { BookOpen, FolderGit2, Database, Book } from "lucide-react";
import { useState, useRef } from "react";
import { DatasetModal } from "../modals/DatasetModal";
import { PaperModal } from "../modals/PaperModal";
import { RepositoryModal } from "../modals/RepositoryModal";
import { NotebookModal } from "../modals/NotebookModal";
import { Button } from "@/components/shadcn/button";
import { BaseMaterialCard, MaterialContext } from "./MaterialCard";

interface MaterialCardProps {
  isOwner: boolean;
  context: MaterialContext;
}

export const PaperCard = ({ 
  paper, 
  isOwner = false,
  context,
  onUpdate,
  onDelete,
  index,
  garden,
}: { 
  paper: Paper;
  onUpdate: (data: Paper) => Promise<void>;
  onDelete: () => void;
  index?: number;
  garden?: Garden,
} & MaterialCardProps) => {
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
        context={{garden: garden}}
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
  context,
  onUpdate,
  onDelete,
  index,
}: { 
  dataset: Dataset;
  onUpdate: (data: Dataset) => Promise<void>;
  onDelete: () => void;
  index?: number;
} & MaterialCardProps) => {
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
        context={{}}
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
  context,
  onUpdate,
  onDelete,
  index,
}: { 
  repository: Repository;
  onUpdate: (data: Repository) => Promise<void>;
  onDelete: () => void;
  index?: number;
} & MaterialCardProps) => {
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
        context={{}}
        edit
        initialData={repository}
        onSave={handleEdit}
        trigger={<Button ref={triggerButtonRef} className="hidden">Edit</Button>}
      />
    </>
  );
};

export const NotebookCard = ({ 
  notebook, 
  isOwner = false,
  context,
  onUpdate,
  onDelete,
}: { 
  notebook: Notebook;
  onUpdate: (data: Notebook) => Promise<void>;
  onDelete: () => void;
} & MaterialCardProps) => {
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
            <div className="flex items-baseline">
              <span className="w-24 text-gray-500 text-xs font-medium">Description</span>
              <div className="flex-1 line-clamp-2">{String(notebook.description)}</div>
            </div>
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
          
          {typeof notebook.type === 'string' && (
            <div className="flex items-baseline">
              <span className="w-24 text-gray-500 text-xs font-medium">Type</span>
              <div className="flex-1 capitalize">{notebook.type}</div>
            </div>
          )}
        </div>
      </BaseMaterialCard>
      
      <NotebookModal
        context={{}}
        edit
        initialData={notebook}
        onSave={handleEdit}
        trigger={<Button ref={triggerButtonRef} className="hidden">Edit</Button>}
      />
    </>
  );
}; 