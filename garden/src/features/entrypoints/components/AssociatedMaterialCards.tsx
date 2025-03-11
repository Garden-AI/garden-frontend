import { Paper, Dataset, Repository } from "@/types";
import { Button } from "@/components/shadcn/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/shadcn/card";
import { Edit2, Book, FileType, Link, Database } from "lucide-react";

import DatasetModal from "./modals/DatasetModal";
import DeleteConfirmationModal from "./modals/DeleteConfirmationModal";
import PaperModal from "./modals/PaperModal";
import RepositoryModal from "./modals/RepositoryModal";

export const PaperCard = ({
  paper,
  index,
  onUpdate,
  onDelete,
}: {
  paper: Paper;
  index: number;
  onUpdate: (d: Paper) => void;
  onDelete: (index: number) => void;
}) => {
  // Create a link from URL or DOI
  const paperLink = paper.url || (paper.doi ? `https://doi.org/${paper.doi}` : undefined);
  
  return (
    <Card className="transition-colors hover:bg-gray-50 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 transition-colors duration-300">
          {paperLink ? (
            <a 
              href={paperLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-600 hover:underline"
            >
              {paper.title}
            </a>
          ) : (
            paper.title
          )}
        </CardTitle>
        {paper.doi && (
          <div className="flex space-x-3">
            <span>DOI: {paper.doi}</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {paper.authors && paper.authors.length > 0 && (
          <div className="mb-2 text-sm text-gray-600">
            <span className="font-semibold">Authors:</span> {paper.authors.join(", ")}
          </div>
        )}
        {paper.citation && (
          <div className="text-sm text-gray-600">
            <span className="font-semibold">Citation:</span> {paper.citation}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <PaperModal
          edit
          index={index}
          initialData={paper}
          onSave={onUpdate}
          trigger={
            <Button variant="ghost" size="sm">
              <Edit2 className="mr-2 h-4 w-4" />
              Edit
            </Button>
          }
        />
        <DeleteConfirmationModal
          title="Delete Paper"
          description="Are you sure you want to delete this paper?"
          onConfirm={() => onDelete(index)}
          itemName="paper"
        />
      </CardFooter>
    </Card>
  );
};

export const DatasetCard = ({
  dataset,
  index,
  onUpdate,
  onDelete,
}: {
  dataset: Dataset;
  index: number;
  onUpdate: (d: Dataset) => void;
  onDelete: (index: number) => void;
}) => {
  return (
    <Card className="transition-colors hover:bg-gray-50 hover:shadow-lg">
      <CardHeader>
        <CardTitle
          className="line-clamp-3  text-xl font-bold text-gray-900 transition-colors duration-300"
          title={dataset.title}
        >
          {dataset.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {dataset.data_type && (
          <div>
            <p className="mb-1 text-sm font-semibold">Data Type: </p>
            <p className="text-sm text-gray-600">{dataset.data_type}</p>
          </div>
        )}

        {dataset.repository && (
          <div className="flex items-center text-sm text-gray-600">
            <Book className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="truncate" title={dataset.repository}>
              {dataset.repository}
            </span>
          </div>
        )}

        {dataset.url && (
          <div className="flex items-center text-sm text-green">
            <Link className="mr-2 h-4 w-4 flex-shrink-0" />
            <a
              href={dataset.url}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate hover:underline"
              title={dataset.url}
            >
              {dataset.url}
            </a>
          </div>
        )}

        {dataset.doi && (
          <div className="flex items-center text-sm text-gray-600">
            <Database className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="truncate" title={dataset.doi}>
              DOI: {dataset.doi}
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="mt-4 flex justify-end space-x-2">
        <DatasetModal
          edit
          onSave={onUpdate}
          initialData={dataset}
          trigger={
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              <Edit2 className="mr-2 h-4 w-4" />
              Edit
            </Button>
          }
        />
        <DeleteConfirmationModal onConfirm={() => onDelete(index)} />
      </CardFooter>
    </Card>
  );
};

export const RepositoryCard = ({
  repository,
  index,
  onUpdate,
  onDelete,
}: {
  repository: Repository;
  index: number;
  onUpdate: (d: Repository) => void;
  onDelete: (index: number) => void;
}) => {
  return (
    <Card className="transition-colors hover:bg-gray-50 hover:shadow-lg">
      <CardHeader>
        <CardTitle
          className="truncate text-xl font-bold text-gray-900 transition-colors duration-300"
          title={repository.repo_name}
        >
          {repository.repo_name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {repository.contributors && (
          <div className="">
            <p className="text-sm font-semibold">Contributors:</p>
            <p className="line-clamp-2 text-sm text-gray-600">
              {repository.contributors.join(", ") || "No contributors listed"}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="mt-4 flex justify-end space-x-2">
        <RepositoryModal
          edit
          onSave={onUpdate}
          initialData={repository}
          trigger={
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              <Edit2 className="mr-2 h-4 w-4" />
              Edit
            </Button>
          }
        />
        <DeleteConfirmationModal onConfirm={() => onDelete(index)} />
      </CardFooter>
    </Card>
  );
};
