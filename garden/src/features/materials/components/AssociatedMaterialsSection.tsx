import { useFieldArray, useFormContext } from "react-hook-form";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { AssociatedMaterialsGrid } from "./AssociatedMaterialsGrid";
import { DatasetModal } from "./modals/DatasetModal";
import { PaperModal } from "./modals/PaperModal";
import { RepositoryModal } from "./modals/RepositoryModal";

interface AssociatedMaterialsSectionProps {
  fieldName: "papers" | "repositories" | "datasets";
}

const AssociatedMaterialsSection = ({ 
  fieldName, 
}: AssociatedMaterialsSectionProps) => {
  const { control } = useFormContext();
  const { fields, append, update, remove } = useFieldArray({
    control,
    name: fieldName,
  });

  // Map field names to their corresponding modal components
  const modalMap = {
    papers: PaperModal,
    repositories: RepositoryModal,
    datasets: DatasetModal
  };

  // Get the appropriate modal component
  const ModalComponent = modalMap[fieldName];
  
  // Get singular form of the field name for the button text
  const singularName = (fieldName === "repositories") ? "repository" : (fieldName.endsWith('s') ? fieldName.slice(0, -1) : fieldName);  
  

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold capitalize">{fieldName}</h3>
        <ModalComponent
          onSave={(data) => append(data)}
          trigger={
            <Button type="button" variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              New {singularName}
            </Button>
          }
        />
      </div>
      <AssociatedMaterialsGrid fields={fields} onUpdate={update} onDelete={remove} />
    </div>
  );
};

export default AssociatedMaterialsSection;
