import { Dataset, Paper, Repository } from "@/types";
import { DatasetCard, PaperCard, RepositoryCard } from "./cards/MaterialCards";

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
        onUpdate={async (data) => onUpdate(index, data)}
        onDelete={() => onDelete(index)}
        isOwner={false}
        context={{}}
      />
    ) : isRepository(resource) ? (
      <RepositoryCard
        key={index}
        repository={resource}
        index={index}
        onUpdate={async (data) => onUpdate(index, data)}
        onDelete={() => onDelete(index)}
        isOwner={false}
        context={{}}
      />
    ) : (
      <PaperCard
        key={index}
        paper={resource}
        index={index}
        onUpdate={async (data) => onUpdate(index, data)}
        onDelete={() => onDelete(index)}
        isOwner={false}
        context={{}}
      />
    );
  };
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {fields.map((resource: any, index: number) => renderCard(resource, index))}
    </div>
  );
};

const isDataset = (resource: any): resource is Dataset => {
  return resource.data_type !== undefined;
};

const isRepository = (resource: any): resource is Repository => {
  return resource.repo_name !== undefined;
};

export { AssociatedMaterialsGrid };
