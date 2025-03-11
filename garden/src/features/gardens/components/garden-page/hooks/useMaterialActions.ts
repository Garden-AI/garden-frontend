import { useState } from "react";
import { toast } from "sonner";
import { ExtendedGarden } from "@/types/garden.types";
import { usePatchModalFunction } from "@/features/modal/api/usePatchModalFunction";
import { ModalFunction } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";

// Extend ModalFunction type to include owner_identity_id
export type ModalFunctionWithOwner = ModalFunction & {
  owner_identity_id: string;
  already_has_material?: boolean;
};

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

export interface UseMaterialActionsOptions<T extends MaterialType> {
  material: T;
  garden: ExtendedGarden;
  findAffectedFunctions?: (doi: string) => ModalFunctionWithOwner[];
  onUpdate?: () => Promise<void>;
  materialType: 'paper' | 'dataset' | 'repository' | 'notebook';
}

// Direct fetch function for getting modal function data
const fetchModalFunction = async (id: number): Promise<ModalFunction & { owner_identity_id?: string }> => {
  try {
    const response = await axios.get(`/modal-functions/${id}`);
    const modalFunction = response.data as ModalFunction;
    
    try {
      // Get the parent modal app to get ownership information
      const modalAppResponse = await axios.get(`/modal-apps/${modalFunction.modal_app_id}`);
      return {
        ...modalFunction,
        owner_identity_id: modalAppResponse.data.owner_identity_id
      };
    } catch (error) {
      // If we can't get ownership info, just return the function
      return modalFunction;
    }
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
  const [editAffectedFunctions, setEditAffectedFunctions] = useState<ModalFunctionWithOwner[]>([]);
  
  // Simplified version of setIsSelectiveEditing without debug logging
  const [isSelectiveEditing, setIsSelectiveEditing] = useState(false);
  
  const [selectiveFunctions, setSelectiveFunctions] = useState<Record<number, boolean>>({});
  const [affectedFunctions, setAffectedFunctions] = useState<ModalFunctionWithOwner[]>([]);
  const [isSelectiveRemoval, setIsSelectiveRemoval] = useState(false);
  const { mutateAsync: patchModalFunction } = usePatchModalFunction();
  const queryClient = useQueryClient();
  
  // Create a link from URL or DOI
  const materialLink = material?.url || (material?.doi ? `https://doi.org/${material.doi}` : undefined);
  
  const prepareFunctionsForEdit = async (updatedMaterial: T) => {
    // For repositories and notebooks, check either DOI or URL. For other materials, require DOI
    const identifier = materialType === 'repository' || materialType === 'notebook'
      ? (material.doi || material.url) 
      : material.doi;
    if (!identifier) {
      return;
    }
    
    // Clear any previous state before starting the edit process
    setEditAffectedFunctions([]);
    setEditSelectiveFunctions({});
    
    try {
      // CRITICAL FIX: Store the updated material first
      console.log('Setting editingMaterial:', updatedMaterial);
      setEditingMaterial(updatedMaterial);
      
      // CRITICAL FIX: Use our direct function checking method 
      const functionsWithMaterial = await directlyCheckFunctionsWithMaterial(identifier);
      
      console.log(`Edit - Found ${functionsWithMaterial.length} functions with material ${identifier}`);
      
      // Get all functions in the garden
      let allFunctions = [...(garden.modal_functions || [])];
      
      // Verify we have functions with this material
      if (functionsWithMaterial.length === 0 && allFunctions.length === 0) {
        toast.error("Could not find any functions to update");
        return;
      }
      
      // Create a set of function IDs that already have the material
      const functionIdsWithMaterial = new Set(
        functionsWithMaterial.map(func => func.id)
      );
      
      // Store all eligible functions, annotated with whether they already have the material
      const allEligibleFunctions = allFunctions.map(func => ({
        ...func,
        owner_identity_id: func.owner_identity_id || garden.owner_identity_id,
        already_has_material: functionIdsWithMaterial.has(func.id)
      }));
      
      console.log('Setting editAffectedFunctions:', allEligibleFunctions);
      // Store the affected functions including annotation
      setEditAffectedFunctions(allEligibleFunctions);
      
      // Initialize the selective functions object with ONLY functions that already have the material selected by default
      const initialSelections: Record<number, boolean> = {};
      allEligibleFunctions.forEach(func => {
        if (typeof func.id === 'number') {
          // Only auto-select functions that already have this material
          initialSelections[func.id] = func.already_has_material || false;
        }
      });
      console.log('Setting editSelectiveFunctions:', initialSelections);
      setEditSelectiveFunctions(initialSelections);
      
      // Show the function selection dialog
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
    console.log('Starting applySelectiveEdit');
    console.log('Current state:', {
      editingMaterial,
      editAffectedFunctions,
      editSelectiveFunctions
    });

    // For repositories, check either DOI or URL. For other materials, require DOI
    const identifier = materialType === 'repository' ? 
      (editingMaterial?.doi || editingMaterial?.url) : 
      editingMaterial?.doi;

    if (!editingMaterial || !identifier || editAffectedFunctions.length === 0) {
      console.error('Missing required data:', {
        editingMaterial: !!editingMaterial,
        identifier: !!identifier,
        affectedFunctionsLength: editAffectedFunctions.length
      });
      setIsSelectiveEditing(false);
      return;
    }
    
    try {
      // Filter functions that are selected for updating
      const functionsToUpdate = editAffectedFunctions.filter(func => 
        typeof func.id === 'number' && editSelectiveFunctions[func.id]
      );
      
      console.log('Functions to update:', functionsToUpdate);
      
      if (functionsToUpdate.length === 0) {
        toast.error(`Please select at least one function to update the ${materialType} in`);
        return;
      }
      
      // Create an array of promises for updating each selected function
      const updatePromises = functionsToUpdate.map(func => {
        // Ensure func.id exists and is a number
        if (typeof func.id !== 'number') {
          console.error('Function ID is not a number:', func);
          return Promise.resolve(); // Skip this function
        }

        // Get current materials
        const currentMaterials = materialType === 'repository' 
          ? (func.repositories || [])
          : (func[`${materialType}s`] || []);
        
        console.log(`Current materials for function ${func.id}:`, currentMaterials);
        
        let updatedMaterials;
        
        // Check if this function already has this material (by DOI or URL for repositories)
        const hasMaterial = currentMaterials.some((m: any) => {
          if (materialType === 'repository') {
            // For repositories, match on either DOI or URL
            return (m.doi && m.doi === identifier) || 
                   (!m.doi && m.url && m.url === identifier);
          } else {
            // For other materials, match on DOI
            return m.doi === identifier;
          }
        });
        
        if (hasMaterial) {
          // If function already has the material, replace it
          updatedMaterials = currentMaterials.map((m: any) => {
            if (materialType === 'repository') {
              // For repositories, match on either DOI or URL
              if ((m.doi && m.doi === identifier) || 
                  (!m.doi && m.url && m.url === identifier)) {
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
        } else {
          // If function doesn't have the material yet, add it
          updatedMaterials = [...currentMaterials, editingMaterial];
        }
        
        console.log(`Preparing patch for function ${func.id}:`, {
          id: func.id,
          updatedMaterials
        });
        
        // CRITICAL FIX: Ensure we're actually returning the patch promise
        return patchModalFunction({
          id: func.id,
          modalFunction: {
            [materialType === 'repository' ? 'repositories' : `${materialType}s`]: updatedMaterials
          }
        });
      }).filter(Boolean);
      
      console.log(`Sending ${updatePromises.length} patch requests...`);
      
      // Wait for all updates to complete
      await Promise.all(updatePromises);
      
      console.log('All patches completed successfully');
      
      toast.success(`${materialType.charAt(0).toUpperCase() + materialType.slice(1)} updated in ${updatePromises.length} function(s)`);
      
      // Reset all state completely to avoid stale references
      setEditingMaterial(null);
      setEditAffectedFunctions([]);
      setEditSelectiveFunctions({});
      setIsSelectiveEditing(false);
      
      // Explicitly invalidate queries for the affected functions and garden
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
      
      // Call the onUpdate callback to refresh the garden data
      if (onUpdate) {
        await onUpdate();
      }
      
    } catch (error) {
      console.error("Error in applySelectiveEdit:", error);
      toast.error(`Failed to update ${materialType}`);
      
      // Reset state even on error
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
  
  // CRITICAL FIX: Direct function to check material references by fetching each function directly
  const directlyCheckFunctionsWithMaterial = async (identifier: string): Promise<ModalFunctionWithOwner[]> => {
    if (!identifier || !garden.modal_functions) {
      console.log("Cannot check functions: missing identifier or garden functions");
      return [];
    }
    
    console.log(`Directly checking which functions have material ${identifier}`);
    
    try {
      // We'll directly fetch each function from the backend to get the freshest data
      const results: ModalFunctionWithOwner[] = [];
      
      // Use Promise.all to fetch all functions concurrently
      await Promise.all(garden.modal_functions.map(async (func) => {
        if (!func.id) return;
        
        try {
          // Directly fetch the function data from the API
          const freshFunction = await fetchModalFunction(func.id);
          
          if (!freshFunction) {
            console.log(`No data returned for function ${func.id}`);
            return;
          }
          
          // Check if this function has the material
          const materialsKey = materialType === 'repository' ? 'repositories' : `${materialType}s`;
          const materials = materialsKey in freshFunction 
            ? (freshFunction as any)[materialsKey] || [] 
            : [];
          
          const hasMaterial = Array.isArray(materials) && 
            materials.some((m: any) => {
              if (materialType === 'repository' || materialType === 'notebook') {
                // For repositories and notebooks, match on either DOI or URL
                return (m.doi && m.doi === identifier) || (m.url && m.url === identifier);
              } else {
                // For other materials, match on DOI
                return m.doi === identifier;
              }
            });
          
          if (hasMaterial) {
            console.log(`Function ${func.id} (${func.title}) HAS material ${identifier}`);
            results.push({
              ...freshFunction,
              owner_identity_id: freshFunction.owner_identity_id || garden.owner_identity_id,
              already_has_material: true
            });
          } else {
            console.log(`Function ${func.id} (${func.title}) does NOT have material ${identifier}`);
          }
        } catch (error) {
          console.error(`Error fetching function ${func.id}:`, error);
        }
      }));
      
      console.log(`Found ${results.length} functions with material ${identifier} via direct API check`);
      return results;
    } catch (error) {
      console.error("Error directly checking functions with material:", error);
      return [];
    }
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
        const currentUserId = garden.current_user_id || garden.owner_identity_id;
        const funcOwnerId = func.owner_identity_id || garden.owner_identity_id;
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
    // For repositories and notebooks, check either DOI or URL. For other materials, require DOI
    const identifier = materialType === 'repository' || materialType === 'notebook'
      ? (material.doi || material.url) 
      : material.doi;
    if (!identifier || affectedFunctions.length === 0) {
      setConfirmRemove(false);
      return;
    }
    
    try {
      // Create an array of promises for updating each affected function
      const updatePromises = affectedFunctions.map(func => {
        // Get current materials
        const currentMaterials = materialType === 'repository' 
          ? func.repositories || []
          : func[`${materialType}s`] || [];
        
        // Remove the material from the list
        const updatedMaterials = currentMaterials.filter((m: any) => {
          if (materialType === 'repository' || materialType === 'notebook') {
            // For repositories and notebooks, match on either DOI or URL
            return !(m.doi === identifier || m.url === identifier);
          } else {
            // For other materials, match on DOI
            return m.doi !== identifier;
          }
        });
        
        // Patch the function with updated materials
        return patchModalFunction({
          id: func.id,
          modalFunction: {
            [materialType === 'repository' ? 'repositories' : `${materialType}s`]: updatedMaterials
          }
        });
      });
      
      // Wait for all updates to complete
      await Promise.all(updatePromises);
      
      // Close the dialog before showing success message
      setConfirmRemove(false);
      
      // Success message
      toast.success(`${materialType.charAt(0).toUpperCase() + materialType.slice(1)} removed from ${affectedFunctions.length} function(s)`);
      
      // Reset all state completely to avoid stale references
      setAffectedFunctions([]);
      setSelectiveFunctions({});
      setIsSelectiveRemoval(false);
      
      // CRITICAL FIX: Explicitly clear all caches to ensure fresh data
      console.log("Clearing caches after removal operation");
      
      // Invalidate function caches
      for (const func of affectedFunctions) {
        if (func.id) {
          await queryClient.invalidateQueries({ queryKey: ["modalFunction", func.id.toString()] });
          await queryClient.refetchQueries({ queryKey: ["modalFunction", func.id.toString()] });
        }
      }
      
      // Invalidate and refetch garden data
      if (garden.doi) {
        await queryClient.invalidateQueries({ queryKey: ["garden", garden.doi] });
        await queryClient.refetchQueries({ queryKey: ["garden", garden.doi] });
      }
      
      // Call the onUpdate callback to refresh the garden data
      if (onUpdate) {
        await onUpdate();
      }
      
      // Add a significant delay to ensure the UI has fully refreshed
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      toast.error(`Failed to remove ${materialType}`);
      console.error(`Error removing ${materialType}:`, error);
      
      // Reset state even on error
      setAffectedFunctions([]);
      setSelectiveFunctions({});
      setConfirmRemove(false);
      setIsSelectiveRemoval(false);
    }
  };
  
  const handleSelectiveRemove = async () => {
    // For repositories and notebooks, check either DOI or URL. For other materials, require DOI
    const identifier = materialType === 'repository' || materialType === 'notebook'
      ? (material.doi || material.url) 
      : material.doi;
    if (!identifier || affectedFunctions.length === 0) {
      setIsSelectiveRemoval(false);
      setConfirmRemove(false);
      return;
    }
    
    try {
      // Filter functions that are selected for updating
      const functionsToUpdate = affectedFunctions.filter(func => 
        func.id && selectiveFunctions[func.id]
      );
      
      if (functionsToUpdate.length === 0) {
        toast.error(`Please select at least one function to remove the ${materialType} from`);
        return;
      }
      
      // Create an array of promises for updating each selected function
      const updatePromises = functionsToUpdate.map(func => {
        // Get current materials
        const currentMaterials = materialType === 'repository' || materialType === 'notebook'
          ? func[materialType === 'repository' ? 'repositories' : 'notebooks'] || []
          : func[`${materialType}s`] || [];
        
        // Remove the material from the list
        const updatedMaterials = currentMaterials.filter((m: any) => {
          if (materialType === 'repository' || materialType === 'notebook') {
            // For repositories and notebooks, match on either DOI or URL
            return !(m.doi === identifier || m.url === identifier);
          } else {
            // For other materials, match on DOI
            return m.doi !== identifier;
          }
        });
        
        // Patch the function with updated materials
        return patchModalFunction({
          id: func.id,
          modalFunction: {
            [materialType === 'repository' ? 'repositories' : `${materialType}s`]: updatedMaterials
          }
        });
      });
      
      // Wait for all updates to complete
      await Promise.all(updatePromises);
      
      // Close the dialog before showing success message
      setConfirmRemove(false);
      
      // Success message
      toast.success(`${materialType.charAt(0).toUpperCase() + materialType.slice(1)} removed from ${functionsToUpdate.length} function(s)`);
      
      // Reset all state completely to avoid stale references
      setAffectedFunctions([]);
      setSelectiveFunctions({});
      setIsSelectiveRemoval(false);
      
      // CRITICAL FIX: Explicitly clear all caches to ensure fresh data
      console.log("Clearing caches after selective removal operation");
      
      // Invalidate function caches
      for (const func of functionsToUpdate) {
        if (func.id) {
          await queryClient.invalidateQueries({ queryKey: ["modalFunction", func.id.toString()] });
          await queryClient.refetchQueries({ queryKey: ["modalFunction", func.id.toString()] });
        }
      }
      
      // Invalidate and refetch garden data
      if (garden.doi) {
        await queryClient.invalidateQueries({ queryKey: ["garden", garden.doi] });
        await queryClient.refetchQueries({ queryKey: ["garden", garden.doi] });
      }
      
      // Call the onUpdate callback to refresh the garden data
      if (onUpdate) {
        await onUpdate();
      }
      
      // Add a significant delay to ensure the UI has fully refreshed
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      toast.error(`Failed to remove ${materialType}`);
      console.error(`Error removing ${materialType}:`, error);
      
      // Reset state even on error
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