import { useMemo, useCallback } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { Dataset, Paper, Repository, Notebook, ModalFunction } from '@/types';
import { ExtendedGarden } from '@/types/garden.types';

// Helper type for functions with owner
type ModalFunctionWithOwner = ModalFunction & {
  owner_identity_id: string;
};

interface MaterialsManagerConfig {
  garden: ExtendedGarden;
  queryClient: QueryClient;
  refetchGarden: () => Promise<void>;
}

export interface MaterialsManager {
  allMaterials: {
    datasets: Dataset[];
    papers: Paper[];
    repositories: Repository[];
    notebooks: Notebook[];
  };
  findFunctionsWithMaterial: (doi: string) => ModalFunctionWithOwner[];
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

export const useMaterialsManager = ({
  garden,
  queryClient,
  refetchGarden,
}: MaterialsManagerConfig): MaterialsManager => {
  // Memoized collections of all materials
  const allMaterials = useMemo(() => {
    return {
      datasets: deduplicateByDOI([
        ...(garden.entrypoints?.map(entrypoint => entrypoint.datasets || []).flat() || []),
        ...(garden.modal_functions?.map(func => func.datasets || []).flat() || [])
      ]),
      papers: deduplicateByDOI([
        ...(garden.entrypoints?.map(entrypoint => entrypoint.papers || []).flat() || []),
        ...(garden.modal_functions?.map(func => func.papers || []).flat() || [])
      ]),
      repositories: deduplicateRepositoriesByURL([
        ...(garden.entrypoints?.map(entrypoint => entrypoint.repositories || []).flat() || []),
        ...(garden.modal_functions?.map(func => func.repositories || []).flat() || [])
      ]),
      notebooks: deduplicateNotebooksByURL([
        ...(garden.entrypoints?.map(entrypoint => entrypoint.notebooks || []).flat() || []),
        ...(garden.modal_functions?.map(func => func.notebooks || []).flat() || [])
      ])
    };
  }, [garden]);

  // Find functions that use a specific material
  const findFunctionsWithMaterial = useCallback((doi: string): ModalFunctionWithOwner[] => {
    if (!garden.doi) return [];
    
    // CRITICAL FIX: Always get the freshest data directly from the query cache
    const latestGardenData = queryClient.getQueryData(["garden", garden.doi]) as ExtendedGarden;
    const currentFunctions = [...(latestGardenData?.modal_functions || [])];
    
    if (!currentFunctions.length) {
      console.warn('No functions found in the latest garden data');
      return [];
    }
    
    console.log(`Finding functions with material ${doi} from ${currentFunctions.length} total functions`);
    
    // Deep check to make sure each function's materials are properly examined
    const functionsWithMaterial = currentFunctions.filter(func => {
      // Defensive coding - ensure func is valid
      if (!func) return false;
      
      // Check datasets
      const hasMaterialInDataset = Array.isArray(func.datasets) && 
        func.datasets.some(dataset => dataset && dataset.doi === doi);
      
      // Check papers
      const hasMaterialInPaper = Array.isArray(func.papers) && 
        func.papers.some(paper => paper && paper.doi === doi);
      
      // Check repositories
      const hasMaterialInRepo = Array.isArray(func.repositories) && 
        func.repositories.some(repo => repo && repo.doi === doi);
      
      // Check notebooks
      const hasMaterialInNotebook = Array.isArray(func.notebooks) && 
        func.notebooks.some(notebook => notebook && notebook.doi === doi);
      
      const hasMaterial = hasMaterialInDataset || hasMaterialInPaper || hasMaterialInRepo || hasMaterialInNotebook;
      
      // Debugging log
      if (hasMaterial) {
        console.log(`Function ${func.id} (${func.title}) has material ${doi}`);
      }
      
      return hasMaterial;
    });
    
    console.log(`Found ${functionsWithMaterial.length} functions with material ${doi}`);
    
    return functionsWithMaterial as ModalFunctionWithOwner[];
  }, [garden.doi, queryClient]);

  // Refresh all materials and related data
  const refreshMaterials = useCallback(async () => {
    // Invalidate function caches
    if (garden.modal_functions) {
      garden.modal_functions.forEach(func => {
        if (func.id) {
          queryClient.invalidateQueries({ queryKey: ["modalFunction", func.id.toString()] });
        }
      });
    }
    
    // Invalidate garden cache
    queryClient.invalidateQueries({ queryKey: ["garden", garden.doi] });
    
    // Refetch garden data
    await refetchGarden();
  }, [garden, queryClient, refetchGarden]);

  return {
    allMaterials,
    findFunctionsWithMaterial,
    refreshMaterials,
  };
}; 