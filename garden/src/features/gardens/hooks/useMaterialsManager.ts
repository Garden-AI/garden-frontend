import { useMemo, useCallback } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { Dataset, Paper, Repository, ModalFunction } from '@/types';
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
  };
  findFunctionsWithMaterial: (doi: string) => ModalFunctionWithOwner[];
  refreshMaterials: () => Promise<void>;
}

// Helper functions for deduplication
const deduplicateByDOI = <T extends { doi?: string | null }>(items: T[]): T[] => {
  return items.filter((item, index, self) => {
    if (!item.doi) return true;
    return index === self.findIndex((t) => t.doi === item.doi);
  });
};

const deduplicateRepositoriesByURL = (repos: Repository[]): Repository[] => {
  return repos.filter((repo, index, self) => {
    if (!repo.url) return true;
    return index === self.findIndex((t) => t.url === repo.url);
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
      ])
    };
  }, [garden]);

  // Find functions that use a specific material
  const findFunctionsWithMaterial = useCallback((doi: string): ModalFunctionWithOwner[] => {
    if (!garden.modal_functions) return [];
    
    const currentFunctions = [...(garden.modal_functions || [])];
    
    return currentFunctions.filter(func => {
      const hasMaterialInDataset = func.datasets?.some(dataset => dataset.doi === doi);
      const hasMaterialInPaper = func.papers?.some(paper => paper.doi === doi);
      const hasMaterialInRepo = func.repositories?.some(repo => repo.doi === doi);
      
      return hasMaterialInDataset || hasMaterialInPaper || hasMaterialInRepo;
    }) as ModalFunctionWithOwner[];
  }, [garden.modal_functions]);

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