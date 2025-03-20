import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/shadcn/button';
import { Dataset, Paper, Repository, Garden, ModalFunction } from '@/types';
import { DatasetModal } from '@/features/materials/components/modals/DatasetModal';
import { PaperModal } from '@/features/materials/components/modals/PaperModal';
import { RepositoryModal } from '@/features/materials/components/modals/RepositoryModal';
import { usePatchGarden } from '@/features/gardens/api/usePatchGarden';
import { toast } from 'sonner';
import { DatasetCard, PaperCard, RepositoryCard } from '@/features/materials/components/cards/MaterialCards';
import AddMaterialWithFunctionSelect from './AddMaterialWithFunctionSelect';

type MaterialType = Dataset | Paper | Repository;
type MaterialsRecord = Record<'papers' | 'repositories' | 'datasets', MaterialType[]>;

interface GardenAssociatedMaterialsSectionProps {
  garden: Garden & MaterialsRecord;
  fieldName: keyof MaterialsRecord;
  isOwner: boolean;
  modalFunction: ModalFunction;
}

const GardenAssociatedMaterialsSection: React.FC<GardenAssociatedMaterialsSectionProps> = ({ 
  garden,
  fieldName,
  isOwner,
  modalFunction
}) => {
  const { mutateAsync: updateGarden } = usePatchGarden();
  
  // Get existing materials from the garden
  const materials = garden[fieldName] || [];

  // Map field names to their corresponding modal components
  const modalMap = {
    papers: PaperModal,
    repositories: RepositoryModal,
    datasets: DatasetModal
  };

  // Get the appropriate modal component
  const ModalComponent = modalMap[fieldName];
  
  // Get singular form of the field name for the button text
  const singularName = (fieldName === "repositories") 
    ? "repository" 
    : (fieldName.endsWith('s') ? fieldName.slice(0, -1) : fieldName);

  const handleUpdateMaterial = async (index: number, data: Dataset | Paper | Repository) => {
    try {
      // Make a copy of existing materials
      const updatedMaterials = [...materials];
      
      // Update the specific item
      updatedMaterials[index] = data;
      
      // Create patch request with just the updated field
      const patchData = { [fieldName]: updatedMaterials };
      
      // Update the garden
      await updateGarden({
        doi: garden.doi,
        garden: patchData
      });
      
      toast.success(`${singularName} updated successfully`);
    } catch (error) {
      toast.error(`Failed to update ${singularName}`);
      console.error('Error updating material:', error);
    }
  };

  const handleDeleteMaterial = async (index: number) => {
    try {
      // Make a copy and remove the item at index
      const updatedMaterials = materials.filter((_: MaterialType, i: number) => i !== index);
      
      // Create patch request with just the updated field
      const patchData = { [fieldName]: updatedMaterials };
      
      // Update the garden
      await updateGarden({
        doi: garden.doi,
        garden: patchData
      });
      
      toast.success(`${singularName} removed successfully`);
    } catch (error) {
      toast.error(`Failed to remove ${singularName}`);
      console.error('Error removing material:', error);
    }
  };

  const renderCards = () => {
    if (materials.length === 0) {
      return (
        <div className="flex min-h-24 items-center justify-center">
          <p className="text-gray-500 italic">No {fieldName} added yet</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-8">
        {materials.map((material: MaterialType, index: number) => {
          const context = {
            parentFunction: modalFunction,
            parentDoi: garden.doi,
            garden: garden
          };

          if (fieldName === 'datasets') {
            return (
              <DatasetCard
                key={index}
                dataset={material as Dataset}
                index={index}
                onUpdate={(data) => handleUpdateMaterial(index, data)}
                onDelete={() => handleDeleteMaterial(index)}
                isOwner={isOwner}
                context={context}
              />
            );
          } else if (fieldName === 'repositories') {
            return (
              <RepositoryCard
                key={index}
                repository={material as Repository}
                index={index}
                onUpdate={(data) => handleUpdateMaterial(index, data)}
                onDelete={() => handleDeleteMaterial(index)}
                isOwner={isOwner}
                context={context}
              />
            );
          } else {
            return (
              <PaperCard
                key={index}
                paper={material as Paper}
                index={index}
                onUpdate={(data) => handleUpdateMaterial(index, data)}
                onDelete={() => handleDeleteMaterial(index)}
                isOwner={isOwner}
                context={context}
              />
            );
          }
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold capitalize">{fieldName}</h3>
        {isOwner && (garden.modal_functions?.length ?? 0) > 0 && (
          <AddMaterialWithFunctionSelect
            garden={garden}
            materialType={fieldName}
            onSuccess={() => {
              // The AddMaterialWithFunctionSelect component handles the actual material addition
              // We just need to refresh the garden data to show the updated materials
              window.location.reload();
            }}
          />
        )}
      </div>
      {renderCards()}
    </div>
  );
};

export default GardenAssociatedMaterialsSection; 