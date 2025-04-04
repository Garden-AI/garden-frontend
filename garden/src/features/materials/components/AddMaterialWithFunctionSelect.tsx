import React, { useState } from 'react';
import { PlusCircle, Loader2, ChevronDownIcon, ChevronUpIcon, CheckCircleIcon } from 'lucide-react';
import { Button } from '@/components/shadcn/button';
import { Garden } from '@/types';
import { Dataset, ModalFunction, Paper, Repository, Notebook } from '@/types';
import { DatasetModal } from '@/features/materials/components/modals/DatasetModal';
import { PaperModal } from '@/features/materials/components/modals/PaperModal';
import { RepositoryModal } from '@/features/materials/components/modals/RepositoryModal';
import { NotebookModal } from '@/features/materials/components/modals/NotebookModal';
import { Checkbox } from '@/components/shadcn/checkbox';
import { Label } from '@/components/shadcn/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/shadcn/dialog';
import { ScrollArea } from '@/components/shadcn/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/shadcn/tooltip';
import { toast } from 'sonner';
import { usePatchModalFunction } from '@/features/modal/api/usePatchModalFunction';

interface AddMaterialWithFunctionSelectProps {
  garden: Garden;
  materialType: 'datasets' | 'papers' | 'repositories' | 'notebooks';
  onSuccess?: () => void;
}

const AddMaterialWithFunctionSelect: React.FC<AddMaterialWithFunctionSelectProps> = ({
  garden,
  materialType,
  onSuccess
}) => {
  // Get all available functions from the garden
  const functions = garden.modal_functions || [];
  
  const [selectedFunctions, setSelectedFunctions] = useState<number[]>(functions.map(f => f.id));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [material, setMaterial] = useState<Dataset | Paper | Repository | Notebook | null>(null);
  const { mutateAsync: patchModalFunction } = usePatchModalFunction();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showFunctionSelector, setShowFunctionSelector] = useState(true);
  const [shouldAddAuthors, setShouldAddAuthors] = useState(false);
  
  // Get singular form of the material type for labels
  const singularName = materialType === 'repositories'
    ? 'repository'
    : materialType.slice(0, -1);
  
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
  
  const handleSelectAll = () => {
    if (selectedFunctions.length === functions.length) {
      // If all are selected, unselect all
      setSelectedFunctions([]);
    } else {
      // Otherwise, select all
      setSelectedFunctions(functions.map(f => f.id));
    }
  };
  
  const clearAllSelections = () => {
    setSelectedFunctions([]);
  };
  
  const toggleFunctionSelector = () => {
    setShowFunctionSelector(!showFunctionSelector);
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
      setIsUpdating(true);
      
      // Create an array of promises for updating each selected function
      const updatePromises = selectedFunctions.map(functionId => {
        const targetFunction = functions.find(f => f.id === functionId);
        if (!targetFunction) return Promise.resolve();
        
        // Get existing materials
        const existingMaterials = targetFunction[materialType] || [];
        
        // Add new material to existing ones
        const updatedMaterials = [...existingMaterials, material];
        
        // Create update object
        const updateObj: any = {
          [materialType]: updatedMaterials
        };
        
        // If this is a paper and shouldAddAuthors is true, add authors to the function
        if (materialType === 'papers' && shouldAddAuthors && (material as Paper).authors?.length) {
          const paperAuthors = (material as Paper).authors || [];
          const existingAuthors = targetFunction.authors || [];
          
          // Create a properly deduplicated list of authors
          const uniqueAuthors = Array.from(new Set([...existingAuthors, ...paperAuthors]));
          
          // Add authors to the update object
          updateObj.authors = uniqueAuthors;
        }
        
        // Patch the function with updated materials
        return patchModalFunction({
          id: functionId,
          modalFunction: updateObj
        });
      });
      
      // Wait for all updates to complete
      await Promise.all(updatePromises);
      
      toast.success(`${singularName} added to selected functions`);
      setIsDialogOpen(false);
      setSelectedFunctions([]);
      setMaterial(null);
      setShouldAddAuthors(false);
      
      // Call onSuccess callback if provided
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(`Failed to add ${singularName} to functions`);
      console.error('Error adding material to functions:', error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Don't render if there are no functions
  if (functions.length === 0) return null;
  
  return (
    <>
      <ModalComponent
        context={{garden: garden}}
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
            <DialogTitle>Add {singularName.charAt(0).toUpperCase() + singularName.slice(1)}</DialogTitle>
            <DialogDescription>
              Choose which functions to add this {singularName.toLowerCase()} to:
            </DialogDescription>
          </DialogHeader>
          
          {!showFunctionSelector ? (
            <div className="py-4 space-y-4">
              <Button 
                variant="outline" 
                type="button" 
                onClick={toggleFunctionSelector}
                className="w-full flex items-center justify-center"
              >
                <span>Choose specific functions</span>
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  Add to All Functions
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <>
              <div className="mb-2 flex items-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={toggleFunctionSelector}
                  className="text-sm flex items-center"
                >
                  <ChevronUpIcon className="mr-1 h-4 w-4" />
                  <span>Hide function selector</span>
                </Button>
              </div>
              
              <div className="mb-4 flex justify-between">
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSelectAll}
                    className="text-xs"
                    disabled={isUpdating}
                  >
                    Select All
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearAllSelections}
                  className="text-xs"
                  disabled={isUpdating}
                >
                  Clear All
                </Button>
              </div>
              
              <ScrollArea className="h-60">
                <div className="space-y-3">
                  {functions.map(func => {
                    const existingMaterials = func[materialType] || [];
                    const alreadyHasMaterial = material && existingMaterials.some(m => m.id === material.id);
                    
                    return (
                      <div 
                        key={func.id} 
                        className={`flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 ${
                          alreadyHasMaterial ? 'border-blue-200 bg-blue-50' : ''
                        }`}
                      >
                        <Checkbox
                          id={`function-${func.id}`}
                          checked={selectedFunctions.includes(func.id)}
                          onCheckedChange={() => handleFunctionToggle(func.id)}
                          disabled={isUpdating}
                        />
                        <Label 
                          htmlFor={`function-${func.id}`}
                          className="flex-1 cursor-pointer"
                        >
                          {func.title || `Function ${func.id}`}
                        </Label>
                        
                        {alreadyHasMaterial && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <CheckCircleIcon className="h-4 w-4 text-blue-500" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>This function already has this {singularName}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
              
              {isUpdating && (
                <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Updating functions...</span>
                </div>
              )}
              
              <DialogFooter className="mt-4">
                {materialType === "papers" && material && (
                  <div className="flex items-center space-x-2 mr-auto">
                    <Checkbox
                      id="add-authors"
                      checked={shouldAddAuthors}
                      onCheckedChange={(checked) => setShouldAddAuthors(checked === true)}
                      disabled={isUpdating}
                    />
                    <Label htmlFor="add-authors" className="text-sm cursor-pointer">
                      Add paper authors to selected functions
                    </Label>
                  </div>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave} 
                  disabled={selectedFunctions.length === 0 || isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Add to Selected'
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddMaterialWithFunctionSelect; 