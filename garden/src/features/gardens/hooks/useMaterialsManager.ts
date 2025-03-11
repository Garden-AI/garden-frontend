import { useMemo, useCallback } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { Dataset, Paper, Repository, Notebook, ModalFunction, Garden } from '@/types';

export interface MaterialsManager {
  allMaterials: {
    datasets: Dataset[];
    papers: Paper[];
    repositories: Repository[];
    notebooks: Notebook[];
  };
  findFunctionsWithMaterial: (doi: string) => ModalFunction[];
  refreshMaterials: () => Promise<void>;
}

// Helper function to deduplicate materials by DOI
const deduplicateByDOI = <T extends { doi?: string | null }>(materials: T[]): T[] => {
  return materials.filter((item, index, self) => {
    if (!item.doi) return true;
    return index === self.findIndex((t) => t.doi === item.doi);
  });
};

// Helper function to deduplicate repositories by URL
const deduplicateRepositoriesByURL = (repositories: Repository[]): Repository[] => {
  return repositories.filter((repo, index, self) => {
    if (!repo.url) return true;
    return index === self.findIndex((t) => t.url === repo.url);
  });
};

// Helper function to deduplicate notebooks by URL
const deduplicateNotebooksByURL = (notebooks: Notebook[]): Notebook[] => {
  return notebooks.filter((notebook, index, self) => {
    if (!notebook.url) return true;
    return index === self.findIndex((t) => t.url === notebook.url);
  });
};

interface MaterialsManagerConfig {
  garden: Garden;
  queryClient: QueryClient;
  refetchGarden: () => Promise<void>;
}

export const useMaterialsManager = ({
  garden,
  queryClient,
  refetchGarden,
}: MaterialsManagerConfig): MaterialsManager => {
  // Memoized collections of all materials
  const allMaterials = useMemo(() => {
    return {
      datasets: deduplicateByDOI([
        ...(garden.modal_functions?.map(func => func.datasets || []).flat() || [])
      ]),
      papers: deduplicateByDOI([
        ...(garden.modal_functions?.map(func => func.papers || []).flat() || [])
      ]),
      repositories: deduplicateRepositoriesByURL([
        ...(garden.modal_functions?.map(func => func.repositories || []).flat() || [])
      ]),
      notebooks: deduplicateNotebooksByURL([
        ...(garden.modal_functions?.map(func => func.notebooks || []).flat() || [])
      ])
    };
  }, [garden]);

  // Find functions that use a specific material
  const findFunctionsWithMaterial = useCallback((doi: string): ModalFunction[] => {
    if (!garden.doi) return [];
    
    // Get the freshest data directly from the query cache
    const latestGardenData = queryClient.getQueryData(["garden", garden.doi]) as Garden;
    const currentFunctions = [...(latestGardenData?.modal_functions || [])];
    
    if (!currentFunctions.length) {
      console.warn('No functions found in the latest garden data');
      return [];
    }
    
    // Deep check to make sure each function's materials are properly examined
    const functionsWithMaterial = currentFunctions.filter(func => {
      if (!func) return false;
      
      const hasMaterialInDataset = Array.isArray(func.datasets) && 
        func.datasets.some(dataset => dataset && dataset.doi === doi);
      
      const hasMaterialInPaper = Array.isArray(func.papers) && 
        func.papers.some(paper => paper && paper.doi === doi);
      
      const hasMaterialInRepo = Array.isArray(func.repositories) && 
        func.repositories.some(repo => repo && (repo.doi === doi || repo.url === doi));
      
      const hasMaterialInNotebook = Array.isArray(func.notebooks) && 
        func.notebooks.some(notebook => notebook && notebook.url === doi);
      
      return hasMaterialInDataset || hasMaterialInPaper || hasMaterialInRepo || hasMaterialInNotebook;
    }).map(func => ({
      ...func,
      already_has_material: true
    }));
    
    return functionsWithMaterial;
  }, [garden.doi, queryClient]);

  // Refresh all materials and related data
  const refreshMaterials = useCallback(async () => {
    // Invalidate function caches
    if (garden.modal_functions) {
      await Promise.all(garden.modal_functions.map(async func => {
        if (func.id) {
          await queryClient.invalidateQueries({ queryKey: ["modalFunction", func.id.toString()] });
        }
      }));
    }
    
    // Invalidate garden cache and wait for it to complete
    await queryClient.invalidateQueries({ queryKey: ["garden", garden.doi] });
    
    // Refetch garden data and wait for completion
    await refetchGarden();
    
    // Ensure the query client settles all pending operations
    await queryClient.resumePausedMutations();
  }, [garden, queryClient, refetchGarden]);

  return {
    allMaterials,
    findFunctionsWithMaterial,
    refreshMaterials,
  };
}; 