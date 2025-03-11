import { useCallback } from 'react';
import { Garden } from '@/types';
import { MaterialsManager } from './useMaterialsManager';

interface MaterialOperationsConfig {
  garden: Garden;
  materialsManager: MaterialsManager;
}

interface MaterialOperations {
  handleMaterialAdded: () => Promise<void>;
  handleMaterialUpdated: () => Promise<void>;
  handleMaterialRemoved: () => Promise<void>;
}

export const useMaterialOperations = ({
  garden,
  materialsManager,
}: MaterialOperationsConfig): MaterialOperations => {
  const { refreshMaterials } = materialsManager;

  // Handle material added
  const handleMaterialAdded = useCallback(async () => {
    await refreshMaterials();
  }, [refreshMaterials]);

  // Handle material updated
  const handleMaterialUpdated = useCallback(async () => {
    await refreshMaterials();
  }, [refreshMaterials]);

  // Handle material removed
  const handleMaterialRemoved = useCallback(async () => {
    await refreshMaterials();
  }, [refreshMaterials]);

  return {
    handleMaterialAdded,
    handleMaterialUpdated,
    handleMaterialRemoved,
  };
}; 