import { useState } from "react";
import { toast } from "sonner";
import { ExtendedGarden } from "@/types/garden.types";
import { usePatchModalFunction } from "@/features/modal/api/usePatchModalFunction";
import { ModalFunction } from "@/types";

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
  [key: string]: any;
};

export interface UseMaterialActionsOptions<T extends MaterialType> {
  material: T;
  garden: ExtendedGarden;
  findAffectedFunctions?: (doi: string) => ModalFunctionWithOwner[];
  onUpdate?: () => void;
  materialType: 'paper' | 'dataset' | 'repository';
}

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
  
  // Create a link from URL or DOI
  const materialLink = material.url || (material.doi ? `https://doi.org/${material.doi}` : undefined);
  
  const prepareFunctionsForEdit = (updatedMaterial: T) => {
    if (!material.doi || !findAffectedFunctions) {
      return;
    }
    
    // Store the updated material
    setEditingMaterial(updatedMaterial);
    
    // Find all functions that already reference this material
    const functionsWithMaterial = findAffectedFunctions(material.doi);
    
    // Get all functions in the garden (to give users the option to add the material to more functions)
    const allFunctions = garden.modal_functions || [];

    // Verify we have functions with this material
    if (functionsWithMaterial.length === 0) {
      toast.error(`Could not find functions referencing this ${materialType}`);
      return;
    }
    
    // Check if we have the current user ID
    if (!garden.current_user_id) {
      // No need to show a warning, just silently use garden owner ID
    }
    
    // Check each function individually for ownership
    const nonOwnedFunctions = functionsWithMaterial.filter(func => {
      const hasOwnerField = 'owner_identity_id' in func;
      const hasId = 'id' in func && typeof func.id !== 'undefined';
      const funcId = hasId ? String(func.id) : 'unknown';
      
      if (BYPASS_MISSING_OWNER_CHECK && !hasOwnerField) {
        return false; // Don't add to nonOwnedFunctions (consider it owned)
      }
      
      // Check if current user is the owner of the function
      // Use either the current_user_id or the garden owner ID for comparison
      const currentUserId = garden.current_user_id || garden.owner_identity_id;
      const isOwner = hasOwnerField && func.owner_identity_id === currentUserId;
      
      return !isOwner;
    });
    
    // Check if user owns all affected functions
    const userOwnsAllFunctions = nonOwnedFunctions.length === 0;
    
    if (!userOwnsAllFunctions) {
      toast.error(`Cannot edit - you don't own ${nonOwnedFunctions.length} function(s) that use this ${materialType}.`);
      return;
    }
    
    // Create a set of function IDs that already have this material for quick lookup
    const functionIdsWithMaterial = new Set(
      functionsWithMaterial.map(func => func.id)
    );
    
    // Filter allFunctions to only include functions the user owns
    const ownedFunctions = allFunctions.filter(func => {
      const hasOwnerField = 'owner_identity_id' in func;
      if (BYPASS_MISSING_OWNER_CHECK && !hasOwnerField) {
        return true; // Consider it owned if field is missing and bypass is enabled
      }
      
      const currentUserId = garden.current_user_id || garden.owner_identity_id;
      return hasOwnerField && func.owner_identity_id === currentUserId;
    }) as ModalFunctionWithOwner[];
    
    // Store all eligible functions, annotated with whether they already have the material
    const allEligibleFunctions = ownedFunctions.map(func => ({
      ...func,
      already_has_material: functionIdsWithMaterial.has(func.id)
    }));
    
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
    setEditSelectiveFunctions(initialSelections);
    
    // Show the function selection dialog
    setIsSelectiveEditing(true);
  };
  
  const handleEdit = async (updatedMaterial: T) => {
    prepareFunctionsForEdit(updatedMaterial);
  };
  
  const applyEditToAllFunctions = async () => {
    if (!editingMaterial || !material.doi || editAffectedFunctions.length === 0) {
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
        const currentMaterials = materialType === 'repository' 
          ? func.repositories || []
          : func[`${materialType}s`] || [];
        
        // Replace the material being edited
        const updatedMaterials = currentMaterials.map((m: any) => 
          m.doi === material.doi ? editingMaterial : m
        );
        
        // Patch the function with updated materials
        return patchModalFunction({
          id: func.id,
          modalFunction: {
            [materialType === 'repository' ? 'repositories' : `${materialType}s`]: updatedMaterials
          }
        });
      }).filter(Boolean); // Filter out any undefined promises
      
      // Wait for all updates to complete
      await Promise.all(updatePromises);
      
      toast.success(`${materialType.charAt(0).toUpperCase() + materialType.slice(1)} updated across ${updatePromises.length} function(s)`);
      setIsSelectiveEditing(false);
      
      // Call the onUpdate callback to refresh the garden data
      if (onUpdate) {
        onUpdate();
      }
      
    } catch (error) {
      toast.error(`Failed to update ${materialType}`);
      console.error(`Error updating ${materialType}:`, error);
      setIsSelectiveEditing(false);
    }
  };
  
  const applySelectiveEdit = async () => {
    if (!editingMaterial || !material.doi || editAffectedFunctions.length === 0) {
      setIsSelectiveEditing(false);
      return;
    }
    
    try {
      // Filter functions that are selected for updating
      const functionsToUpdate = editAffectedFunctions.filter(func => 
        typeof func.id === 'number' && editSelectiveFunctions[func.id]
      );
      
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
          ? func.repositories || []
          : func[`${materialType}s`] || [];
        
        let updatedMaterials;
        
        // Check if this function already has this material (by DOI)
        const hasMaterial = currentMaterials.some((m: any) => m.doi === material.doi);
        
        if (hasMaterial) {
          // If function already has the material, replace it
          updatedMaterials = currentMaterials.map((m: any) => 
            m.doi === material.doi ? editingMaterial : m
          );
        } else {
          // If function doesn't have the material yet, add it
          updatedMaterials = [...currentMaterials, editingMaterial];
        }
        
        // Patch the function with updated materials
        return patchModalFunction({
          id: func.id,
          modalFunction: {
            [materialType === 'repository' ? 'repositories' : `${materialType}s`]: updatedMaterials
          }
        });
      }).filter(Boolean); // Filter out any undefined promises
      
      // Wait for all updates to complete
      await Promise.all(updatePromises);
      
      toast.success(`${materialType.charAt(0).toUpperCase() + materialType.slice(1)} updated in ${updatePromises.length} function(s)`);
      setIsSelectiveEditing(false);
      
      // Call the onUpdate callback to refresh the garden data
      if (onUpdate) {
        onUpdate();
      }
      
    } catch (error) {
      toast.error(`Failed to update ${materialType}`);
      console.error(`Error updating ${materialType}:`, error);
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
  
  const prepareFunctionsForRemoval = () => {
    if (!material.doi || !findAffectedFunctions) {
      return;
    }
    
    // Find all functions that already reference this material
    const functionsWithMaterial = findAffectedFunctions(material.doi);
    
    if (functionsWithMaterial.length === 0) {
      toast.error(`Could not find functions referencing this ${materialType}`);
      return;
    }
    
    // Check if we have the current user ID
    if (!garden.current_user_id) {
      // No need to show a warning, just silently use garden owner ID
    }
    
    // Check each function individually for ownership
    const nonOwnedFunctions = functionsWithMaterial.filter(func => {
      const hasOwnerField = 'owner_identity_id' in func;
      const hasId = 'id' in func && typeof func.id !== 'undefined';
      const funcId = hasId ? String(func.id) : 'unknown';
      
      if (BYPASS_MISSING_OWNER_CHECK && !hasOwnerField) {
        return false; // Don't add to nonOwnedFunctions (consider it owned)
      }
      
      // Check if current user is the owner of the function
      // Use either the current_user_id or the garden owner ID for comparison
      const currentUserId = garden.current_user_id || garden.owner_identity_id;
      const isOwner = hasOwnerField && func.owner_identity_id === currentUserId;
      
      return !isOwner;
    });
    
    // Check if user owns all affected functions
    const userOwnsAllFunctions = nonOwnedFunctions.length === 0;
    
    if (!userOwnsAllFunctions) {
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
  };
  
  const handleRemoveAll = async () => {
    if (!material.doi || affectedFunctions.length === 0) {
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
        const updatedMaterials = currentMaterials.filter((m: any) => m.doi !== material.doi);
        
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
      
      toast.success(`${materialType.charAt(0).toUpperCase() + materialType.slice(1)} removed from ${affectedFunctions.length} function(s)`);
      setConfirmRemove(false);
      
      // Call the onUpdate callback to refresh the garden data
      if (onUpdate) {
        onUpdate();
      }
      
    } catch (error) {
      toast.error(`Failed to remove ${materialType}`);
      console.error(`Error removing ${materialType}:`, error);
      setConfirmRemove(false);
    }
  };
  
  const handleSelectiveRemove = async () => {
    if (!material.doi || affectedFunctions.length === 0) {
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
        const currentMaterials = materialType === 'repository' 
          ? func.repositories || []
          : func[`${materialType}s`] || [];
        
        // Remove the material from the list
        const updatedMaterials = currentMaterials.filter((m: any) => m.doi !== material.doi);
        
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
      
      toast.success(`${materialType.charAt(0).toUpperCase() + materialType.slice(1)} removed from ${functionsToUpdate.length} function(s)`);
      setIsSelectiveRemoval(false);
      setConfirmRemove(false);
      
      // Call the onUpdate callback to refresh the garden data
      if (onUpdate) {
        onUpdate();
      }
      
    } catch (error) {
      toast.error(`Failed to remove ${materialType}`);
      console.error(`Error removing ${materialType}:`, error);
      setIsSelectiveRemoval(false);
      setConfirmRemove(false);
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