import { useState } from "react";
import { toast } from "sonner";
import { Garden, ModalFunction, Dataset, Paper, Repository, Notebook } from '@/types';
import { usePatchModalFunction } from "@/features/modal/api/usePatchModalFunction";
import { useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";

// Temporary flag to bypass ownership check if the field is missing
// Set to false to enforce strict ownership checking once the backend includes the field
const BYPASS_MISSING_OWNER_CHECK = true;

export type MaterialType = {
  doi?: string;
  url?: string;
  title: string;
  description?: string | null;
  [key: string]: any;
};

// Type for accessing material collections with proper types
type MaterialCollectionKey = 'datasets' | 'papers' | 'repositories' | 'notebooks';

// Helper function to safely access material collections
const getMaterialCollection = (func: ModalFunction, materialType: string): any[] => {
  const key = `${materialType}s` as MaterialCollectionKey;
  return (func[key] as any[]) || [];
};

export interface UseMaterialActionsOptions<T extends MaterialType> {
  material: T;
  garden: Garden;
  findAffectedFunctions?: (doi: string) => ModalFunction[];
  onUpdate?: () => Promise<void>;
  materialType: 'paper' | 'dataset' | 'repository' | 'notebook';
}

// Direct fetch function for getting modal function data
const fetchModalFunction = async (id: number): Promise<ModalFunction> => {
  try {
    const response = await axios.get(`/modal-functions/${id}`);
    return response.data as ModalFunction;
  } catch (error) {
    throw new Error(`Error fetching modal function ${id}`);
  }
};

export function useMaterialActions<T extends MaterialType>({
  material,
  garden,
  findAffectedFunctions,
  onUpdate,
  materialType
}: UseMaterialActionsOptions<T>) {
  const [expanded, setExpanded] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editSelectiveFunctions, setEditSelectiveFunctions] = useState<Record<number, boolean>>({});
  const [editingMaterial, setEditingMaterial] = useState<T | null>(null);
  const [editAffectedFunctions, setEditAffectedFunctions] = useState<ModalFunction[]>([]);
  
  // Simplified version of setIsSelectiveEditing without debug logging
  const [isSelectiveEditing, setIsSelectiveEditing] = useState(false);
  
  const [selectiveFunctions, setSelectiveFunctions] = useState<Record<number, boolean>>({});
  const [affectedFunctions, setAffectedFunctions] = useState<ModalFunction[]>([]);
  const [isSelectiveRemoval, setIsSelectiveRemoval] = useState(false);
  const { mutateAsync: patchModalFunction } = usePatchModalFunction();
  const queryClient = useQueryClient();
  
  // Create a link from URL or DOI
  const materialLink = material?.url || (material?.doi ? `https://doi.org/${material.doi}` : undefined);
  
  const prepareFunctionsForEdit = async (updatedMaterial: T) => {
    const identifier = materialType === 'repository' || materialType === 'notebook'
      ? (material.doi || material.url) 
      : material.doi;
    if (!identifier) {
      return;
    }
    
    setEditAffectedFunctions([]);
    setEditSelectiveFunctions({});
    
    try {
      setEditingMaterial(updatedMaterial);
      const functionsWithMaterial = await directlyCheckFunctionsWithMaterial(identifier);
      let allFunctions = [...(garden.modal_functions || [])];
      
      if (functionsWithMaterial.length === 0 && allFunctions.length === 0) {
        toast.error("Could not find any functions to update");
        return;
      }
      
      const functionIdsWithMaterial = new Set(
        functionsWithMaterial.map(func => func.id)
      );
      
      const allEligibleFunctions = allFunctions.map(func => ({
        ...func,
        already_has_material: functionIdsWithMaterial.has(func.id)
      }));
      
      setEditAffectedFunctions(allEligibleFunctions);
      
      const initialSelections: Record<number, boolean> = {};
      allEligibleFunctions.forEach(func => {
        if (typeof func.id === 'number') {
          initialSelections[func.id] = func.already_has_material || false;
        }
      });
      setEditSelectiveFunctions(initialSelections);
      
      setIsSelectiveEditing(true);
    } catch (error) {
      console.error("Error preparing functions for edit:", error);
      toast.error(`Failed to prepare functions for edit: ${error}`);
    }
  };
  
  const handleEdit = async (updatedMaterial: T) => {
    prepareFunctionsForEdit(updatedMaterial);
  };
  
  const applyEditToAllFunctions = async () => {
    // For repositories and notebooks, check either DOI or URL. For other materials, require DOI
    const identifier = materialType === 'repository' || materialType === 'notebook'
      ? (editingMaterial?.doi || editingMaterial?.url) 
      : editingMaterial?.doi;
    if (!editingMaterial || !identifier || editAffectedFunctions.length === 0) {
      setIsSelectiveEditing(false);
      return;
    }
    
    try {
      // Create an array of promises for updating each affected function
      const updatePromises = editAffectedFunctions.map(func => {
        // Ensure func.id exists and is a number
        if (typeof func.id !== 'number') {
          console.error('Function ID is not a number:', func);
          return Promise.resolve(); // Skip this function
        }

        // Get current materials based on type
        const currentMaterials = materialType === 'repository' || materialType === 'notebook'
          ? func[materialType === 'repository' ? 'repositories' : 'notebooks'] || []
          : func[`${materialType}s`] || [];
        
        // Replace the material being edited
        const updatedMaterials = currentMaterials.map((m: any) => {
          if (materialType === 'repository' || materialType === 'notebook') {
            // For repositories and notebooks, match on either DOI or URL
            if ((m.doi && m.doi === identifier) || (!m.doi && m.url && m.url === identifier)) {
              return editingMaterial;
            }
          } else {
            // For other materials, match on DOI
            if (m.doi === identifier) {
              return editingMaterial;
            }
          }
          return m;
        });
        
        // Patch the function with updated materials
        return patchModalFunction({
          id: func.id,
          modalFunction: {
            [materialType === 'repository' ? 'repositories' : `${materialType}s`]: updatedMaterials
          }
        });
      }).filter(Boolean);
      
      // Wait for all updates to complete
      await Promise.all(updatePromises);
      
      toast.success(`${materialType.charAt(0).toUpperCase() + materialType.slice(1)} updated across ${updatePromises.length} function(s)`);
      
      // Reset all state completely to avoid stale references
      setEditingMaterial(null);
      setEditAffectedFunctions([]);
      setEditSelectiveFunctions({});
      setIsSelectiveEditing(false);
      
      // Explicitly invalidate queries for the affected functions and garden
      for (const func of editAffectedFunctions) {
        if (func.id) {
          await queryClient.invalidateQueries({ queryKey: ["modalFunction", func.id.toString()] });
          await queryClient.refetchQueries({ queryKey: ["modalFunction", func.id.toString()] });
        }
      }
      
      if (garden.doi) {
        await queryClient.invalidateQueries({ queryKey: ["garden", garden.doi] });
        await queryClient.refetchQueries({ queryKey: ["garden", garden.doi] });
      }
      
      // Call the onUpdate callback to refresh the garden data
      if (onUpdate) {
        await onUpdate();
      }
      
    } catch (error) {
      toast.error(`Failed to update ${materialType}`);
      console.error(`Error updating ${materialType}:`, error);
      
      // Reset state even on error
      setEditingMaterial(null);
      setEditAffectedFunctions([]);
      setEditSelectiveFunctions({});
      setIsSelectiveEditing(false);
    }
  };
  
  const applySelectiveEdit = async () => {
    const identifier = materialType === 'repository' ? 
      (editingMaterial?.doi || editingMaterial?.url) : 
      editingMaterial?.doi;

    if (!editingMaterial || !identifier || editAffectedFunctions.length === 0) {
      console.error('Missing required data for selective edit');
      setIsSelectiveEditing(false);
      return;
    }
    
    try {
      const functionsToUpdate = editAffectedFunctions.filter(func => 
        typeof func.id === 'number' && editSelectiveFunctions[func.id]
      );
      
      if (functionsToUpdate.length === 0) {
        toast.error(`Please select at least one function to update the ${materialType} in`);
        return;
      }
      
      const updatePromises = functionsToUpdate.map(func => {
        if (typeof func.id !== 'number') {
          console.error('Function ID is not a number:', func);
          return Promise.resolve();
        }

        const currentMaterials = materialType === 'repository' 
          ? (func.repositories || [])
          : (func[`${materialType}s`] || []);
        
        let updatedMaterials;
        
        const hasMaterial = currentMaterials.some((m: any) => {
          if (materialType === 'repository') {
            return (m.doi && m.doi === identifier) || 
                   (!m.doi && m.url && m.url === identifier);
          } else {
            return m.doi === identifier;
          }
        });
        
        if (hasMaterial) {
          updatedMaterials = currentMaterials.map((m: any) => {
            if (materialType === 'repository') {
              if ((m.doi && m.doi === identifier) || 
                  (!m.doi && m.url && m.url === identifier)) {
                return editingMaterial;
              }
            } else {
              if (m.doi === identifier) {
                return editingMaterial;
              }
            }
            return m;
          });
        } else {
          updatedMaterials = [...currentMaterials, editingMaterial];
        }
        
        return patchModalFunction({
          id: func.id,
          modalFunction: {
            [materialType === 'repository' ? 'repositories' : `${materialType}s`]: updatedMaterials
          }
        });
      }).filter(Boolean);
      
      await Promise.all(updatePromises);
      
      toast.success(`${materialType.charAt(0).toUpperCase() + materialType.slice(1)} updated in ${updatePromises.length} function(s)`);
      
      setEditingMaterial(null);
      setEditAffectedFunctions([]);
      setEditSelectiveFunctions({});
      setIsSelectiveEditing(false);
      
      for (const func of functionsToUpdate) {
        if (func.id) {
          await queryClient.invalidateQueries({ queryKey: ["modalFunction", func.id.toString()] });
          await queryClient.refetchQueries({ queryKey: ["modalFunction", func.id.toString()] });
        }
      }
      
      if (garden.doi) {
        await queryClient.invalidateQueries({ queryKey: ["garden", garden.doi] });
        await queryClient.refetchQueries({ queryKey: ["garden", garden.doi] });
      }
      
      if (onUpdate) {
        await onUpdate();
      }
      
    } catch (error) {
      console.error("Error in applySelectiveEdit:", error);
      toast.error(`Failed to update ${materialType}`);
      
      setEditingMaterial(null);
      setEditAffectedFunctions([]);
      setEditSelectiveFunctions({});
      setIsSelectiveEditing(false);
    }
  };
  
  const toggleEditFunction = (id: number) => {
    setEditSelectiveFunctions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const toggleEditAll = (value: boolean) => {
    const newSelections: Record<number, boolean> = {};
    editAffectedFunctions.forEach(func => {
      if (func.id) {
        newSelections[func.id] = value;
      }
    });
    setEditSelectiveFunctions(newSelections);
  };
  
  const directlyCheckFunctionsWithMaterial = async (identifier: string): Promise<ModalFunction[]> => {
    // Get all functions in the garden
    const allFunctions = garden.modal_functions || [];
    
    // Filter functions that have this material
    const functionsWithMaterial = allFunctions.filter(func => {
      const materials = materialType === 'repository' || materialType === 'notebook'
        ? func[materialType === 'repository' ? 'repositories' : 'notebooks'] || []
        : func[`${materialType}s`] || [];
      
      return materials.some((m: any) => {
        if (materialType === 'repository' || materialType === 'notebook') {
          // For repositories and notebooks, match on either DOI or URL
          return (m.doi && m.doi === identifier) || (!m.doi && m.url && m.url === identifier);
        } else {
          // For other materials, match on DOI
          return m.doi === identifier;
        }
      });
    });
    
    return functionsWithMaterial;
  };

  const prepareFunctionsForRemoval = async () => {
    // For repositories and notebooks, check either DOI or URL. For other materials, require DOI
    const identifier = materialType === 'repository' || materialType === 'notebook'
      ? (material.doi || material.url) 
      : material.doi;
    if (!identifier) {
      return;
    }
    
    // Clear any previous state before starting the removal process
    setAffectedFunctions([]);
    setSelectiveFunctions({});
    
    try {
      // CRITICAL FIX: Use our direct function checking method instead of findAffectedFunctions
      // This bypasses the cache and gets fresh data for each function
      const functionsWithMaterial = await directlyCheckFunctionsWithMaterial(identifier);
      
      if (functionsWithMaterial.length === 0) {
        toast.error(`Could not find functions referencing this ${materialType}`);
        return;
      }
      
      console.log(`Found ${functionsWithMaterial.length} functions with material ${identifier}`);
      
      // Check if user owns all affected functions
      const nonOwnedFunctions = functionsWithMaterial.filter(func => {
        // Use only garden.owner_identity_id since current_user_id is not in the type
        const currentUserId = garden.owner_identity_id;
        // Get owner ID from the modal app response
        const funcOwnerId = garden.owner_identity_id; // Default to garden owner if function owner not available
        return funcOwnerId !== currentUserId;
      });
      
      if (nonOwnedFunctions.length > 0) {
        toast.error(`Cannot remove - you don't own ${nonOwnedFunctions.length} function(s) that use this ${materialType}.`);
        return;
      }
      
      // Mark all functions as having the material
      // For removal, we only want to show functions that already have the material
      const functionsWithMaterialMarked = functionsWithMaterial.map(func => ({
        ...func,
        already_has_material: true
      }));
      
      // Store the affected functions with already_has_material flag
      setAffectedFunctions(functionsWithMaterialMarked);
      
      // Initialize the selective functions object with all functions selected by default
      const initialSelections: Record<number, boolean> = {};
      functionsWithMaterialMarked.forEach(func => {
        if (typeof func.id === 'number') {
          // All functions shown already have the material, so select them all by default
          initialSelections[func.id] = true;
        }
      });
      setSelectiveFunctions(initialSelections);
      
      // Always go directly to selective removal mode
      setIsSelectiveRemoval(true);
      
      // Open the confirmation dialog
      setConfirmRemove(true);
    } catch (error) {
      console.error("Error preparing functions for removal:", error);
      toast.error(`Failed to prepare functions for removal: ${error}`);
    }
  };
  
  const handleRemoveAll = async () => {
    try {
      const identifier = materialType === 'repository' ? material.url :
                        materialType === 'notebook' ? (material.doi || material.url) :
                        material.doi;
      if (!identifier) {
        console.warn('No identifier found for removal');
        return;
      }

      const functionsToUpdate = await directlyCheckFunctionsWithMaterial(identifier);
      
      if (functionsToUpdate.length === 0) {
        console.warn('No functions found with material:', identifier);
        toast.error(`Could not find functions referencing this ${materialType}`);
        return;
      }

      await Promise.all(
        functionsToUpdate.map(async (func) => {
          if (!func.id) {
            console.warn('Function missing ID:', func);
            return;
          }

          const materialsKey = materialType === 'repository' ? 'repositories' :
                             `${materialType}s` as 'datasets' | 'papers' | 'repositories' | 'notebooks';
          
          const currentMaterials = func[materialsKey] || [];
          const updatedMaterials = currentMaterials.filter((m: any) => {
            if (materialType === 'repository') {
              return m.url !== identifier;
            } else if (materialType === 'notebook') {
              return !(m.doi === identifier || m.url === identifier);
            } else {
              return m.doi !== identifier;
            }
          });

          const patchData = {
            datasets: func.datasets || [],
            papers: func.papers || [],
            repositories: func.repositories || [],
            notebooks: func.notebooks || [],
            [materialsKey]: updatedMaterials
          };

          await patchModalFunction({
            id: func.id,
            modalFunction: patchData
          });

          await Promise.all([
            queryClient.invalidateQueries({ queryKey: ["modalFunction", func.id.toString()] }),
            queryClient.invalidateQueries({ queryKey: ["modalFunction"] }),
            queryClient.refetchQueries({ queryKey: ["modalFunction", func.id.toString()] })
          ]);
        })
      );
      
      if (garden.doi) {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["garden", garden.doi] }),
          queryClient.invalidateQueries({ queryKey: ["garden"] }),
          queryClient.refetchQueries({ queryKey: ["garden", garden.doi] })
        ]);
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onUpdate) {
        await onUpdate();
      }
      
      toast.success(`${materialType.charAt(0).toUpperCase() + materialType.slice(1)} removed successfully`);
      setConfirmRemove(false);
    } catch (error) {
      console.error('Error removing material:', error);
      toast.error('Failed to remove material');
      setConfirmRemove(false);
    }
  };
  
  const handleSelectiveRemove = async () => {
    const identifier = materialType === 'repository' ? material.url :
                      materialType === 'notebook' ? (material.doi || material.url) :
                      material.doi;
    if (!identifier || affectedFunctions.length === 0) {
      setIsSelectiveRemoval(false);
      setConfirmRemove(false);
      return;
    }
    
    try {
      const functionsToUpdate = affectedFunctions.filter(func => 
        func.id && selectiveFunctions[func.id]
      );
      
      if (functionsToUpdate.length === 0) {
        toast.error(`Please select at least one function to remove the ${materialType} from`);
        return;
      }
      
      const updatePromises = functionsToUpdate.map(async func => {
        if (!func.id) {
          console.warn('Function missing ID:', func);
          return;
        }

        const materialsKey = materialType === 'repository' ? 'repositories' :
                           `${materialType}s` as 'datasets' | 'papers' | 'repositories' | 'notebooks';
        
        const currentMaterials = func[materialsKey] || [];
        
        const updatedMaterials = currentMaterials.filter((m: any) => {
          if (materialType === 'repository') {
            return m.url !== identifier;
          } else if (materialType === 'notebook') {
            return !(m.doi === identifier || m.url === identifier);
          } else {
            return m.doi !== identifier;
          }
        });

        const patchData = {
          datasets: func.datasets || [],
          papers: func.papers || [],
          repositories: func.repositories || [],
          notebooks: func.notebooks || [],
          [materialsKey]: updatedMaterials
        };

        await patchModalFunction({
          id: func.id,
          modalFunction: patchData
        });

        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["modalFunction", func.id.toString()] }),
          queryClient.invalidateQueries({ queryKey: ["modalFunction"] }),
          queryClient.refetchQueries({ queryKey: ["modalFunction", func.id.toString()] })
        ]);
      });
      
      await Promise.all(updatePromises);
      
      if (garden.doi) {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["garden", garden.doi] }),
          queryClient.invalidateQueries({ queryKey: ["garden"] }),
          queryClient.refetchQueries({ queryKey: ["garden", garden.doi] })
        ]);
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onUpdate) {
        await onUpdate();
      }
      
      toast.success(`${materialType.charAt(0).toUpperCase() + materialType.slice(1)} removed from ${functionsToUpdate.length} function(s)`);
      
      setAffectedFunctions([]);
      setSelectiveFunctions({});
      setConfirmRemove(false);
      setIsSelectiveRemoval(false);
      
    } catch (error) {
      console.error('Error removing material:', error);
      toast.error(`Failed to remove ${materialType}`);
      
      setAffectedFunctions([]);
      setSelectiveFunctions({});
      setConfirmRemove(false);
      setIsSelectiveRemoval(false);
    }
  };
  
  const toggleFunction = (id: number) => {
    setSelectiveFunctions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const toggleAll = (value: boolean) => {
    const newSelections: Record<number, boolean> = {};
    affectedFunctions.forEach(func => {
      if (func.id) {
        newSelections[func.id] = value;
      }
    });
    setSelectiveFunctions(newSelections);
  };

  return {
    expanded,
    setExpanded,
    confirmRemove,
    setConfirmRemove,
    isEditing,
    setIsEditing,
    editSelectiveFunctions,
    editingMaterial,
    editAffectedFunctions,
    isSelectiveEditing,
    setIsSelectiveEditing,
    selectiveFunctions,
    affectedFunctions,
    isSelectiveRemoval,
    setIsSelectiveRemoval,
    materialLink,
    prepareFunctionsForEdit,
    handleEdit,
    applyEditToAllFunctions,
    applySelectiveEdit,
    toggleEditFunction,
    toggleEditAll,
    prepareFunctionsForRemoval,
    handleRemoveAll,
    handleSelectiveRemove,
    toggleFunction,
    toggleAll
  };
} 