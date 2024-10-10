import { Dataset, Paper, Repository } from "@/api/types";
import { DatasetCard, PaperCard, RepositoryCard } from "./AssociatedMaterialCards";

interface Resource {
  [key: string]: any;
}

interface AssociatedMaterialsGridProps {
  fields: any;
  onUpdate: (index: number, data: Resource) => void;
  onDelete: (index: number) => void;
}

const AssociatedMaterialsGrid: React.FC<AssociatedMaterialsGridProps> = ({
  fields,
  onUpdate,
  onDelete,
}) => {
  if (!fields || fields.length === 0)
    return <div className="flex min-h-24 items-center justify-center"></div>;

  const renderCard = (resource: Paper | Repository | Dataset, index: number) => {
    return isDataset(resource) ? (
      <DatasetCard
        key={index}
        dataset={resource}
        index={index}
        onUpdate={(data) => onUpdate(index, data)}
        onDelete={() => onDelete(index)}
      />
    ) : isRepository(resource) ? (
      <RepositoryCard
        key={index}
        repository={resource}
        index={index}
        onUpdate={(data) => onUpdate(index, data)}
        onDelete={() => onDelete(index)}
      />
    ) : (
      <PaperCard
        key={index}
        paper={resource}
        index={index}
        onUpdate={(data) => onUpdate(index, data)}
        onDelete={() => onDelete(index)}
      />
    );
  };
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {fields.map((resource: any, index: number) => renderCard(resource, index))}
    </div>
  );
};

function isDataset(resource: any): resource is Dataset {
  return resource.data_type !== undefined;
}

function isRepository(resource: any): resource is Repository {
  return resource.repo_name !== undefined;
}

export default AssociatedMaterialsGrid;
