import React, { useState } from 'react';
import { ReactNode } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/shadcn/card";
import { Button } from "@/components/shadcn/button";
import { Edit2, Trash2 } from "lucide-react";
import { ModalFunction, Garden } from '@/types';
import { RemoveDialog } from './MaterialDialogs';
import { usePatchModalFunction } from '@/features/modal/api/usePatchModalFunction';
import { toast } from 'sonner';
import { PaperModal } from '../modals/PaperModal';
import { DatasetModal } from '../modals/DatasetModal';
import { RepositoryModal } from '../modals/RepositoryModal';
import { NotebookModal } from '../modals/NotebookModal';

// Define the context interface that represents where this material is being used
export interface MaterialContext {
  parentFunction: ModalFunction;
  garden?: Garden;
  parentDoi?: string;
}

export interface BaseMaterialCardProps {
  material: any;
  materialType: 'paper' | 'dataset' | 'repository' | 'notebook';
  isOwner: boolean;
  context: MaterialContext;
  icon: ReactNode;
  title: string;
  onEdit: (updatedMaterial?: any) => void;
  onEditClick: () => void;
  children: ReactNode;
}

export const BaseMaterialCard = ({
  material,
  materialType,
  isOwner,
  icon,
  title,
  onEdit,
  onEditClick,
  children,
  context
}: BaseMaterialCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectiveFunctions, setSelectiveFunctions] = useState<Record<number, boolean>>({});
  const [isSelectiveRemoval, setIsSelectiveRemoval] = useState(false);
  const { mutateAsync: patchModalFunction } = usePatchModalFunction();
  const materialLink = material?.url || (material?.doi ? `https://doi.org/${material.doi}` : undefined);

  // Get the material type in plural form for the API
  const materialTypePlural = `${materialType}s` as 'papers' | 'datasets' | 'repositories' | 'notebooks';
  
  // Get functions that already have this material
  let functions: ModalFunction[] = [];
  
  // If we're in a garden context, get all functions from the garden
  if (context.garden) {
    functions = context.garden.modal_functions || [];
  } else {
    // If we're in a function context, just use the parent function
    functions = [context.parentFunction];
  }
  
  const affectedFunctions = functions.map((func: ModalFunction) => {
    // Get materials from the function for the current material type
    const funcMaterials = func[materialTypePlural] || [];
    return {
      ...func,
      already_has_material: funcMaterials.some((m: any) => m.id === material.id)
    };
  });

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      // Get functions that have this material
      const functionsWithMaterial = affectedFunctions.filter((func: ModalFunction) => func.already_has_material);
      
      // Create an array of promises for updating each selected function
      const updatePromises = functionsWithMaterial.map((func: ModalFunction) => {
        if (!func.id) return Promise.resolve();
        
        // Get existing materials
        const existingMaterials = func[materialTypePlural] || [];
        
        // Remove the material
        const updatedMaterials = existingMaterials.filter((m: any) => m.id !== material.id);
        
        // Patch the function with updated materials
        return patchModalFunction({
          id: func.id,
          modalFunction: {
            [materialTypePlural]: updatedMaterials
          }
        });
      });
      
      // Wait for all updates to complete
      await Promise.all(updatePromises);
      
      toast.success(`${materialType} removed from functions`);
      setShowDeleteDialog(false);
      onEdit(); // Call the parent's onEdit to refresh the UI
    } catch (error) {
      toast.error(`Failed to remove ${materialType}`);
      console.error('Error removing material:', error);
    }
  };

  const handleSelectiveDelete = async () => {
    try {
      // Get selected functions that have this material
      const selectedFunctionsWithMaterial = affectedFunctions.filter(
        (func: ModalFunction) => func.already_has_material && selectiveFunctions[func.id!]
      );
      
      // Create an array of promises for updating each selected function
      const updatePromises = selectedFunctionsWithMaterial.map((func: ModalFunction) => {
        if (!func.id) return Promise.resolve();
        
        // Get existing materials
        const existingMaterials = func[materialTypePlural] || [];
        
        // Remove the material
        const updatedMaterials = existingMaterials.filter((m: any) => m.id !== material.id);
        
        // Patch the function with updated materials
        return patchModalFunction({
          id: func.id,
          modalFunction: {
            [materialTypePlural]: updatedMaterials
          }
        });
      });
      
      // Wait for all updates to complete
      await Promise.all(updatePromises);
      
      toast.success(`${materialType} removed from selected functions`);
      setShowDeleteDialog(false);
      onEdit(); // Call the parent's onEdit to refresh the UI
    } catch (error) {
      toast.error(`Failed to remove ${materialType}`);
      console.error('Error removing material:', error);
    }
  };

  const handleEdit = async (updatedMaterial: any) => {
    try {
      // Get functions that have this material
      const functionsWithMaterial = affectedFunctions.filter((func: ModalFunction) => func.already_has_material);
      
      // Create an array of promises for updating each selected function
      const updatePromises = functionsWithMaterial.map((func: ModalFunction) => {
        if (!func.id) return Promise.resolve();
        
        // Get existing materials
        const existingMaterials = func[materialTypePlural] || [];
        
        // Update the material
        const updatedMaterials = existingMaterials.map((m: any) => 
          m.id === material.id ? updatedMaterial : m
        );
        
        // Patch the function with updated materials
        return patchModalFunction({
          id: func.id,
          modalFunction: {
            [materialTypePlural]: updatedMaterials
          }
        });
      });
      
      // Wait for all updates to complete
      await Promise.all(updatePromises);
      
      toast.success(`${materialType} updated in functions`);
      setShowDeleteDialog(false);
      onEdit(); // Call the parent's onEdit to refresh the UI
    } catch (error) {
      toast.error(`Failed to update ${materialType}`);
      console.error('Error updating material:', error);
    }
  };

  const toggleDeleteFunction = (id: number) => {
    setSelectiveFunctions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleDeleteAll = (value: boolean) => {
    const newState = affectedFunctions.reduce((acc: Record<number, boolean>, func: ModalFunction) => {
      if (func.id) {
        acc[func.id] = value;
      }
      return acc;
    }, {});
    setSelectiveFunctions(newState);
  };

  // Determine if we need to show function selection dialogs
  // Only show in garden context
  const showFunctionSelection = !!context.garden;

  // Get the appropriate modal component based on material type
  const EditModal = {
    paper: PaperModal,
    dataset: DatasetModal,
    repository: RepositoryModal,
    notebook: NotebookModal
  }[materialType];

  return (
    <>
      <Card className="rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md overflow-hidden group backdrop-blur-sm bg-white">
        <CardHeader className="pt-5 pb-2 bg-gradient-to-r from-white to-gray-50 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="text-green bg-green/10 p-2 rounded-lg flex-shrink-0">
              {icon}
            </div>
            <CardTitle className="font-medium text-lg text-gray-800 tracking-tight">
              {materialLink ? (
                <a 
                  href={materialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 hover:underline transition-colors"
                >
                  {title}
                </a>
              ) : (
                <span>{title}</span>
              )}
            </CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="pt-4 pb-2 text-sm">
          <div className="text-gray-700">
            {children}
          </div>
        </CardContent>
        
        <CardFooter className="px-5 py-3 border-t border-gray-100 bg-gray-50/80 flex items-center justify-end">
          {isOwner && (
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {EditModal && (
                <EditModal
                  edit={true}
                  initialData={material}
                  onSave={handleEdit}
                  trigger={
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-gray-600 hover:text-green hover:bg-green/10 transition-colors h-7 px-2 rounded-md"
                      aria-label={`Edit ${materialType}`}
                    >
                      <Edit2 className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </Button>
                  }
                />
              )}
              
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors h-7 px-2 rounded-md"
                onClick={handleDelete}
                aria-label={`Remove ${materialType}`}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Remove
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>

      {/* Only show function selection for delete in garden context */}
      {showFunctionSelection && (
        <RemoveDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          materialType={materialType}
          affectedFunctions={affectedFunctions}
          selectiveFunctions={selectiveFunctions}
          toggleFunction={toggleDeleteFunction}
          toggleAll={toggleDeleteAll}
          handleRemoveAll={handleConfirmDelete}
          handleSelectiveRemove={handleSelectiveDelete}
          isSelectiveRemoval={isSelectiveRemoval}
          setIsSelectiveRemoval={setIsSelectiveRemoval}
        />
      )}
    </>
  );
}; 