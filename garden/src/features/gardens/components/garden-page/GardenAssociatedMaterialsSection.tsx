import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/shadcn/button';
import { Dataset, Paper, Repository } from '@/types';
import { ExtendedGarden } from '@/types/garden.types';
import DatasetModal from '@/features/entrypoints/components/modals/DatasetModal';
import PaperModal from '@/features/entrypoints/components/modals/PaperModal';
import RepositoryModal from '@/features/entrypoints/components/modals/RepositoryModal';
import { usePatchGarden } from '@/features/gardens/api/usePatchGarden';
import { toast } from 'sonner';
import { DatasetCard, PaperCard, RepositoryCard } from '@/features/entrypoints/components/AssociatedMaterialCards';

interface GardenAssociatedMaterialsSectionProps {
  garden: ExtendedGarden;
  fieldName: 'papers' | 'repositories' | 'datasets';
}

const GardenAssociatedMaterialsSection: React.FC<GardenAssociatedMaterialsSectionProps> = ({ 
  garden,
  fieldName 
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

  const handleAddMaterial = async (data: Dataset | Paper | Repository) => {
    try {
      // Get existing materials or empty array
      const existingMaterials = garden[fieldName] || [];
      
      // Create updated array with new material
      const updatedMaterials = [...existingMaterials, data];
      
      // Create patch request with just the updated field
      const patchData = { [fieldName]: updatedMaterials };
      
      // Update the garden
      await updateGarden({
        doi: garden.doi,
        garden: patchData
      });
      
      toast.success(`${singularName} added successfully`);
    } catch (error) {
      toast.error(`Failed to add ${singularName}`);
      console.error('Error adding material:', error);
    }
  };

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
      const updatedMaterials = materials.filter((_, i) => i !== index);
      
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {materials.map((material, index) => {
          if (fieldName === 'datasets') {
            return (
              <DatasetCard
                key={index}
                dataset={material as Dataset}
                index={index}
                onUpdate={(data) => handleUpdateMaterial(index, data)}
                onDelete={() => handleDeleteMaterial(index)}
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
        <ModalComponent
          onSave={handleAddMaterial}
          trigger={
            <Button type="button" variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add {singularName.toLowerCase()}
            </Button>
          }
        />
      </div>
      {renderCards()}
    </div>
  );
};

export default GardenAssociatedMaterialsSection; 