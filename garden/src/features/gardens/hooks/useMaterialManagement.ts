import { useMemo } from 'react';
import { Dataset, Paper, Repository, Notebook, ModalFunction } from '@/types';
import { ExtendedGarden, MaterialWithDOI, MaterialManagementHook } from '@/types/garden.types';
import { useMaterialsContext } from '../contexts/MaterialsContext';

// Generic type for material with optional DOI
interface MaterialWithDOI {
  doi?: string | null;
  title: string;
  [key: string]: any;
}

export const useMaterialManagement = <T extends MaterialWithDOI>(
  garden: ExtendedGarden,
  getMaterialsFromEntrypoint: (entrypoint: ExtendedGarden['entrypoints'][0]) => T[],
  getMaterialsFromFunction: (func: ExtendedGarden['modal_functions'][0]) => T[],
  deduplicationKey: keyof T = 'doi' as keyof T
): MaterialManagementHook<T> => {
  const { refreshMaterials, findFunctionsWithMaterial } = useMaterialsContext();

  // Collect and deduplicate materials
  const materials = useMemo(() => {
    const allMaterials = [
      ...(garden.entrypoints?.map(entrypoint => getMaterialsFromEntrypoint(entrypoint) || []).flat() || []),
      ...(garden.modal_functions?.map(func => getMaterialsFromFunction(func) || []).flat() || [])
    ];

    // Log for debugging
    console.log('All materials before deduplication:', allMaterials);

    return allMaterials.filter((item, index, self) => {
      // Skip items with no deduplication key
      if (!item[deduplicationKey]) return true;
      
      return index === self.findIndex((t) => t[deduplicationKey] === item[deduplicationKey]);
    });
  }, [garden, getMaterialsFromEntrypoint, getMaterialsFromFunction, deduplicationKey]);

  return {
    materials,
    refreshMaterials,
    findFunctionsWithMaterial
  };
};

// Type-specific hooks
export const useDatasetManagement = (garden: ExtendedGarden): MaterialManagementHook<Dataset> => {
  return useMaterialManagement<Dataset>(
    garden,
    (entrypoint) => entrypoint.datasets || [],
    (func) => func.datasets || []
  );
};

export const usePaperManagement = (garden: ExtendedGarden): MaterialManagementHook<Paper> => {
  return useMaterialManagement<Paper>(
    garden,
    (entrypoint) => entrypoint.papers || [],
    (func) => func.papers || []
  );
};

export const useRepositoryManagement = (garden: ExtendedGarden): MaterialManagementHook<Repository> => {
  return useMaterialManagement<Repository>(
    garden,
    (entrypoint) => entrypoint.repositories || [],
    (func) => func.repositories || [],
    'url' // Use URL as deduplication key for repositories
  );
};

export const useNotebookManagement = (garden: ExtendedGarden): MaterialManagementHook<Notebook> => {
  // Log for debugging
  console.log('Garden entrypoints:', garden.entrypoints);
  console.log('Garden modal functions:', garden.modal_functions);

  return useMaterialManagement<Notebook>(
    garden,
    (entrypoint) => {
      const notebooks = entrypoint.notebooks || [];
      console.log('Notebooks from entrypoint:', notebooks);
      return notebooks;
    },
    (func) => {
      const notebooks = func.notebooks || [];
      console.log('Notebooks from function:', notebooks);
      return notebooks;
    },
    'url' // Use URL as deduplication key for notebooks
  );
}; 