import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/shadcn/button';
import { ExtendedGarden } from '@/types/garden.types';
import { Dataset, ModalFunction, Paper, Repository, Notebook } from '@/types';
import DatasetModal from '@/features/entrypoints/components/modals/DatasetModal';
import PaperModal from '@/features/entrypoints/components/modals/PaperModal';
import RepositoryModal from '@/features/entrypoints/components/modals/RepositoryModal';
import NotebookModal from '@/features/entrypoints/components/modals/NotebookModal';
import { Checkbox } from '@/components/shadcn/checkbox';
import { Label } from '@/components/shadcn/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/shadcn/dialog';
import { toast } from 'sonner';
import { usePatchModalFunction } from '@/features/modal/api/usePatchModalFunction';

interface AddMaterialWithFunctionSelectProps {
  garden: ExtendedGarden;
  materialType: 'datasets' | 'papers' | 'repositories' | 'notebooks';
  onSuccess?: () => void;
}

const AddMaterialWithFunctionSelect: React.FC<AddMaterialWithFunctionSelectProps> = ({
  garden,
  materialType,
  onSuccess
}) => {
  const [selectedFunctions, setSelectedFunctions] = useState<number[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [material, setMaterial] = useState<Dataset | Paper | Repository | Notebook | null>(null);
  const { mutateAsync: patchModalFunction } = usePatchModalFunction();
  
  // Get all available functions from the garden
  const functions = garden.modal_functions || [];
  
  // Get singular form of the material type for labels
  const singularName = materialType === 'repositories'
    ? 'repository'
    : materialType.endsWith('s')
      ? materialType.slice(0, -1)
      : materialType;
  
  // Map material types to their modal components
  const modalMap = {
    datasets: DatasetModal,
    papers: PaperModal,
    repositories: RepositoryModal,
    notebooks: NotebookModal
  };
  
  const ModalComponent = modalMap[materialType];
  
  // Handle checkbox change
  const handleFunctionToggle = (functionId: number) => {
    setSelectedFunctions(prev => 
      prev.includes(functionId)
        ? prev.filter(id => id !== functionId)
        : [...prev, functionId]
    );
  };
  
  // Handle material selection from modal
  const handleMaterialSelect = (data: Dataset | Paper | Repository | Notebook) => {
    setMaterial(data);
    setIsDialogOpen(true);
  };
  
  // Handle saving material to selected functions
  const handleSave = async () => {
    if (!material || selectedFunctions.length === 0) {
      toast.error("Please select at least one function");
      return;
    }
    
    try {
      // Create an array of promises for updating each selected function
      const updatePromises = selectedFunctions.map(functionId => {
        const targetFunction = functions.find(f => f.id === functionId);
        if (!targetFunction) return Promise.resolve();
        
        // Get existing materials
        const existingMaterials = targetFunction[materialType] || [];
        
        // Add new material to existing ones
        const updatedMaterials = [...existingMaterials, material];
        
        // Patch the function with updated materials
        return patchModalFunction({
          id: functionId,
          modalFunction: {
            [materialType]: updatedMaterials
          }
        });
      });
      
      // Wait for all updates to complete
      await Promise.all(updatePromises);
      
      toast.success(`${singularName} added to selected functions`);
      setIsDialogOpen(false);
      setSelectedFunctions([]);
      setMaterial(null);
      
      // Call onSuccess callback if provided
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(`Failed to add ${singularName} to functions`);
      console.error('Error adding material to functions:', error);
    }
  };
  
  const handleSelectAll = () => {
    if (selectedFunctions.length === functions.length) {
      // If all are selected, unselect all
      setSelectedFunctions([]);
    } else {
      // Otherwise, select all
      setSelectedFunctions(functions.map(f => f.id));
    }
  };
  
  // Don't render if there are no functions
  if (functions.length === 0) return null;
  
  return (
    <>
      <ModalComponent
        onSave={handleMaterialSelect}
        trigger={
          <Button type="button" variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add {singularName.toLowerCase()}
          </Button>
        }
      />
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Functions</DialogTitle>
          </DialogHeader>
          
          <div className="my-4">
            <p className="text-sm text-gray-500 mb-4">
              Choose which functions to associate this {singularName} with:
            </p>
            
            <div className="flex items-center space-x-2 mb-4 pb-2 border-b">
              <Checkbox
                id="select-all"
                checked={selectedFunctions.length === functions.length}
                onCheckedChange={handleSelectAll}
              />
              <Label htmlFor="select-all" className="font-medium">Select All</Label>
            </div>
            
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {functions.map(func => (
                <div key={func.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`function-${func.id}`}
                    checked={selectedFunctions.includes(func.id)}
                    onCheckedChange={() => handleFunctionToggle(func.id)}
                  />
                  <Label htmlFor={`function-${func.id}`} className="line-clamp-1">
                    {func.title}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={selectedFunctions.length === 0}>
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddMaterialWithFunctionSelect; 