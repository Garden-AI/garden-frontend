import { useFieldArray, useFormContext } from "react-hook-form";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import AssociatedMaterialsGrid from "./AssociatedMaterialsGrid";
import DatasetModal from "./modals/DatasetModal";
import PaperModal from "./modals/PaperModal";
import RepositoryModal from "./modals/RepositoryModal";

const AssociatedMaterials = () => {
  return (
    <div className="space-y-8 py-6">
      <AssociatedMaterialsSection fieldName="repositories" resourceType="repository" />
      <AssociatedMaterialsSection fieldName="datasets" resourceType="dataset" />
      <AssociatedMaterialsSection fieldName="papers" resourceType="paper" />
    </div>
  );
};

interface RepositorySectionProps {
  resourceType: string;
  fieldName: string;
}

const AssociatedMaterialsSection = ({ fieldName, resourceType }: RepositorySectionProps) => {
  const { control } = useFormContext();
  const { fields, append, update, remove } = useFieldArray({
    control,
    name: fieldName,
  });

  const Modal = () => {
    switch (resourceType) {
      case "repository":
        return (
          <RepositoryModal
            onSave={(data) => append(data)}
            trigger={
              <Button type="button" variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                New {resourceType}
              </Button>
            }
          />
        );
      case "dataset":
        return (
          <DatasetModal
            onSave={(data) => append(data)}
            trigger={
              <Button type="button" variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                New {resourceType}
              </Button>
            }
          />
        );
      case "paper":
        return (
          <PaperModal
            onSave={(data) => append(data)}
            trigger={
              <Button type="button" variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                New {resourceType}
              </Button>
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold capitalize">{fieldName}</h3>
        <Modal />
      </div>
      <AssociatedMaterialsGrid fields={fields} onUpdate={update} onDelete={remove} />
    </div>
  );
};

export default AssociatedMaterials;
