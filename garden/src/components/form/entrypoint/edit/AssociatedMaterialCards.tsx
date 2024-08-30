import { Paper, Dataset, Repository } from "@/api/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Edit2, Book, FileType, Trash2, Link } from "lucide-react";

import DatasetModal from "./Modals/DatasetModal";
import DeleteConfirmationModal from "./Modals/DeleteConfirmationModal";
import PaperModal from "./Modals/PaperModal";
import RepositoryModal from "./Modals/RepositoryModal";

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
  return (
    <Card className="transition-colors hover:bg-gray-50 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 transition-colors duration-300">
          {paper.title}
        </CardTitle>
        {paper.doi && (
          <div className="flex space-x-3">
            <span>DOI: {paper.doi}</span>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {paper.citation && (
          <div className="mb-4">
            <p className="mb-1 text-sm font-bold">Citation:</p>
            <p className="text-gray-700">{paper.citation}</p>
          </div>
        )}
        {paper.authors && paper.authors.length > 0 && (
          <div className="">
            <p className="text-sm font-semibold">Authors:</p>
            <p>{paper.authors.join(", ")}</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="mt-4 flex justify-end space-x-2">
        <PaperModal
          edit
          onSave={onUpdate}
          initialData={paper}
          trigger={
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary"
            >
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
          <div className="flex items-center text-sm text-blue-600">
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
            <FileType className="mr-2 h-4 w-4 flex-shrink-0" />
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
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary"
            >
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
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary"
            >
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
