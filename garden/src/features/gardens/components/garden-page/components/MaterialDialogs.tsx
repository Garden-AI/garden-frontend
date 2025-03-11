import { useState, useEffect } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/shadcn/alert-dialog";
import { Button } from "@/components/shadcn/button";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Label } from "@/components/shadcn/label";
import { ScrollArea } from "@/components/shadcn/scroll-area";
import { ModalFunctionWithOwner } from "../hooks/useMaterialActions";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/shadcn/tooltip";
import { InfoIcon, PlusCircleIcon, CheckCircleIcon, AlertCircleIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

interface EditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  materialType: string;
  editAffectedFunctions: ModalFunctionWithOwner[] & { already_has_material?: boolean }[];
  editSelectiveFunctions: Record<number, boolean>;
  toggleEditFunction: (id: number) => void;
  toggleEditAll: (value: boolean) => void;
  applyEditToAllFunctions: () => Promise<void>;
  applySelectiveEdit: () => Promise<void>;
}

export const EditDialog = ({
  isOpen,
  onClose,
  materialType,
  editAffectedFunctions,
  editSelectiveFunctions,
  toggleEditFunction,
  toggleEditAll,
  applyEditToAllFunctions,
  applySelectiveEdit
}: EditDialogProps) => {
  const [showFunctionSelector, setShowFunctionSelector] = useState(false);
  
  // Reset states when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setShowFunctionSelector(false);
    }
  }, [isOpen]);
  
  const handleCancel = () => {
    onClose();
  };
  
  const clearAllSelections = () => {
    toggleEditAll(false);
  };
  
  const selectAllFunctions = () => {
    toggleEditAll(true);
  };
  
  const selectOnlyExistingFunctions = () => {
    // Clear all first
    toggleEditAll(false);
    
    // Then select only those that already have the material
    editAffectedFunctions.forEach(func => {
      if (func.already_has_material && func.id) {
        toggleEditFunction(func.id);
      }
    });
  };
  
  const toggleFunctionSelector = () => {
    setShowFunctionSelector(!showFunctionSelector);
    
    // When expanding, only select functions that already have the material, not all functions
    if (!showFunctionSelector) {
      selectOnlyExistingFunctions();
    }
  };
  
  const hasSelectedFunctions = Object.values(editSelectiveFunctions).some(Boolean);
  const existingFunctionsCount = editAffectedFunctions.filter(func => func.already_has_material).length;
  const totalFunctionsCount = editAffectedFunctions.length;
  
  // Safety check: if there are no affected functions, don't show the dialog
  if (totalFunctionsCount === 0 && isOpen) {
    // Close the dialog automatically if there are no functions to update
    setTimeout(() => onClose(), 0);
    return null;
  }
  
  // Additional debug info to help diagnose issues
  console.log('EditDialog - Total functions count:', totalFunctionsCount);
  console.log('EditDialog - Existing functions count:', existingFunctionsCount);
  console.log('EditDialog - Affected functions:', editAffectedFunctions.map(f => f.id));
  
  return (
    <Dialog open={isOpen} onOpenChange={(isOpen) => {
      if (!isOpen) handleCancel();
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update {materialType.charAt(0).toUpperCase() + materialType.slice(1)}</DialogTitle>
          <DialogDescription className="space-y-2">
            <p>This will update the {materialType} information in your functions.</p>
            {existingFunctionsCount > 0 && (
              <p className="text-sm font-medium text-amber-600 bg-amber-50 p-2 rounded border border-amber-200 flex items-start">
                <AlertCircleIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                This {materialType} is referenced by {existingFunctionsCount} function{existingFunctionsCount !== 1 ? 's' : ''}.
              </p>
            )}
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
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              
              <Button onClick={applyEditToAllFunctions}>
                Update Existing References
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
                  onClick={selectAllFunctions}
                  className="text-xs"
                >
                  Select All
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={selectOnlyExistingFunctions}
                  className="text-xs"
                >
                  Select Only Existing
                </Button>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearAllSelections}
                className="text-xs"
              >
                Clear All
              </Button>
            </div>
            
            <ScrollArea className="h-60">
              <div className="space-y-3">
                {editAffectedFunctions.map((func) => (
                  <div key={func.id} className={`flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 ${func.already_has_material ? 'border-blue-200 bg-blue-50' : ''}`}>
                    <Checkbox 
                      id={`function-${func.id}`} 
                      checked={editSelectiveFunctions[func.id] || false} 
                      onCheckedChange={() => toggleEditFunction(func.id)}
                    />
                    <Label 
                      htmlFor={`function-${func.id}`}
                      className="flex-1 cursor-pointer"
                    >
                      {func.title || `Function ${func.id}`}
                    </Label>
                    
                    {func.already_has_material ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <CheckCircleIcon className="h-4 w-4 text-blue-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>This function already has this {materialType}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <PlusCircleIcon className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Selecting this will ADD this {materialType} to the function</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              
              <Button 
                onClick={applySelectiveEdit} 
                disabled={!hasSelectedFunctions}
              >
                Update Selected
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

interface RemoveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  materialType: string;
  affectedFunctions: ModalFunctionWithOwner[] & { already_has_material?: boolean }[];
  selectiveFunctions: Record<number, boolean>;
  toggleFunction: (id: number) => void;
  toggleAll: (value: boolean) => void;
  handleRemoveAll: () => Promise<void>;
  handleSelectiveRemove: () => Promise<void>;
  isSelectiveRemoval: boolean;
  setIsSelectiveRemoval: (value: boolean) => void;
}

export const RemoveDialog = ({
  isOpen,
  onClose,
  materialType,
  affectedFunctions,
  selectiveFunctions,
  toggleFunction,
  toggleAll,
  handleRemoveAll,
  handleSelectiveRemove,
  isSelectiveRemoval,
  setIsSelectiveRemoval
}: RemoveDialogProps) => {
  const [showFunctionSelector, setShowFunctionSelector] = useState(false);
  
  // Reset states when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setShowFunctionSelector(false);
      setIsSelectiveRemoval(false);
    }
  }, [isOpen, setIsSelectiveRemoval]);
  
  const handleCancel = () => {
    setIsSelectiveRemoval(false);
    onClose();
  };
  
  const clearAllSelections = () => {
    toggleAll(false);
  };
  
  const selectAllFunctions = () => {
    toggleAll(true);
  };
  
  const selectOnlyExistingFunctions = () => {
    // Clear all first
    toggleAll(false);
    
    // Then select only those that already have the material
    affectedFunctions.forEach(func => {
      if (func.already_has_material && func.id) {
        toggleFunction(func.id);
      }
    });
  };
  
  const toggleFunctionSelector = () => {
    setShowFunctionSelector(!showFunctionSelector);
    
    // When expanding, only select functions that already have the material, not all functions
    if (!showFunctionSelector) {
      selectOnlyExistingFunctions();
      setIsSelectiveRemoval(true);
    }
  };
  
  const hasSelectedFunctions = Object.values(selectiveFunctions).some(Boolean);
  const totalFunctionsCount = affectedFunctions.length;
  
  // Safety check: if there are no affected functions, don't show the dialog
  if (totalFunctionsCount === 0 && isOpen) {
    // Close the dialog automatically if there are no functions to update
    setTimeout(() => onClose(), 0);
    return null;
  }
  
  // Additional debug info to help diagnose issues
  console.log('RemoveDialog - Functions count:', totalFunctionsCount);
  console.log('RemoveDialog - Affected functions:', affectedFunctions.map(f => f.id));
  
  return (
    <AlertDialog open={isOpen} onOpenChange={(isOpen) => {
      if (!isOpen) handleCancel();
    }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Remove {materialType.charAt(0).toUpperCase() + materialType.slice(1)}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>This will remove the {materialType} from your functions.</p>
            {totalFunctionsCount > 0 && (
              <p className="text-sm font-medium text-amber-600 bg-amber-50 p-2 rounded border border-amber-200 flex items-start">
                <AlertCircleIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                This {materialType} is referenced by {totalFunctionsCount} function{totalFunctionsCount !== 1 ? 's' : ''}.
              </p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
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
            
            <AlertDialogFooter className="mt-4">
              <AlertDialogCancel onClick={handleCancel}>
                Cancel
              </AlertDialogCancel>
              
              <AlertDialogAction onClick={handleRemoveAll} className="bg-red-600 hover:bg-red-700">
                Remove From All Functions
              </AlertDialogAction>
            </AlertDialogFooter>
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
                  onClick={selectAllFunctions}
                  className="text-xs"
                >
                  Select All
                </Button>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearAllSelections}
                className="text-xs"
              >
                Clear All
              </Button>
            </div>
            
            <ScrollArea className="h-60">
              <div className="space-y-3">
                {affectedFunctions.map((func) => (
                  <div key={func.id} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50">
                    <Checkbox 
                      id={`remove-function-${func.id}`} 
                      checked={selectiveFunctions[func.id] || false} 
                      onCheckedChange={() => toggleFunction(func.id)}
                    />
                    <Label 
                      htmlFor={`remove-function-${func.id}`}
                      className="flex-1 cursor-pointer"
                    >
                      {func.title || `Function ${func.id}`}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <AlertDialogFooter className="mt-4">
              <AlertDialogCancel onClick={handleCancel}>
                Cancel
              </AlertDialogCancel>
              
              <AlertDialogAction 
                onClick={handleSelectiveRemove} 
                disabled={!hasSelectedFunctions}
                className="bg-red-600 hover:bg-red-700"
              >
                Remove From Selected
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}; 