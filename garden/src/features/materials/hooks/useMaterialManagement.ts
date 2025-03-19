import { useMemo, useCallback } from 'react';
import { Dataset, Paper, Repository, Notebook, Garden, ModalFunction } from '@/types';
import { useMaterialsContext } from '../contexts/MaterialsContext';
import type { MaterialWithDOI } from '@/types/garden.types';

interface MaterialManagementHook<T> {
  materials: T[];
  refreshMaterials: () => Promise<void>;
  findFunctionsWithMaterial: (doi: string) => ModalFunction[];
}

export const useMaterialManagement = <T extends MaterialWithDOI>(
  garden: Garden,
  getMaterialsFromEntrypoint: (entrypoint: NonNullable<Garden['entrypoints']>[number]) => T[],
  getMaterialsFromFunction: (func: NonNullable<Garden['modal_functions']>[number]) => T[],
  deduplicationKey: keyof T = 'doi' as keyof T
): MaterialManagementHook<T> => {
  const { refreshMaterials, findFunctionsWithMaterial } = useMaterialsContext();

  const materials = useMemo(() => {
    const allMaterials = [
      ...(garden.entrypoints?.map(entrypoint => getMaterialsFromEntrypoint(entrypoint) || []).flat() || []),
      ...(garden.modal_functions?.map(func => getMaterialsFromFunction(func) || []).flat() || [])
    ];

    return allMaterials.filter((item, index, self) => {
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

const deduplicateWithFallback = <T extends { doi?: string | null; url?: string | null }>(
  materials: T[],
): T[] => {
  return materials.filter((item, index, self) => {
    if (item.doi) {
      return index === self.findIndex((t) => t.doi === item.doi);
    }
    if (item.url) {
      return index === self.findIndex((t) => !t.doi && t.url === item.url);
    }
    return true;
  });
};

export const useDatasetManagement = (garden: Garden): MaterialManagementHook<Dataset> => {
  const { refreshMaterials: contextRefreshMaterials } = useMaterialsContext();
  
  const materials = useMemo(() => {
    const functionDatasets = (garden.modal_functions || [])
      .map(fn => fn.datasets || [])
      .flat();
    
    return deduplicateWithFallback(functionDatasets);
  }, [garden.modal_functions]);

  const findFunctionsWithMaterial = useCallback((identifier: string): ModalFunction[] => {
    return (garden.modal_functions || [])
      .filter(fn => fn.datasets?.some(dataset => 
        dataset.doi === identifier || (!dataset.doi && dataset.url === identifier)
      ))
      .map(fn => ({
        ...fn,
        already_has_material: true
      }));
  }, [garden.modal_functions]);

  const refreshMaterials = useCallback(async () => {
    await contextRefreshMaterials();
  }, [contextRefreshMaterials]);

  return { materials, findFunctionsWithMaterial, refreshMaterials };
};

export const usePaperManagement = (garden: Garden): MaterialManagementHook<Paper & { title: string }> => {
  const { refreshMaterials: contextRefreshMaterials } = useMaterialsContext();
  
  const materials = useMemo(() => {
    const functionPapers = (garden.modal_functions || [])
      .map(fn => fn.papers || [])
      .flat()
      .map(paper => ({
        ...paper,
        title: paper.title || 'Untitled Paper'
      }));
    
    return deduplicateWithFallback(functionPapers);
  }, [garden.modal_functions]);

  const findFunctionsWithMaterial = useCallback((identifier: string): ModalFunction[] => {
    return (garden.modal_functions || [])
      .filter(fn => fn.papers?.some(paper => 
        paper.doi === identifier || (!paper.doi && paper.url === identifier)
      ))
      .map(fn => ({
        ...fn,
        already_has_material: true
      }));
  }, [garden.modal_functions]);

  const refreshMaterials = useCallback(async () => {
    await contextRefreshMaterials();
  }, [contextRefreshMaterials]);

  return { materials, findFunctionsWithMaterial, refreshMaterials };
};

export const useRepositoryManagement = (garden: Garden): MaterialManagementHook<Repository & { title: string }> => {
  const { refreshMaterials: contextRefreshMaterials } = useMaterialsContext();
  
  const materials = useMemo(() => {
    const functionRepos = (garden.modal_functions || [])
      .map(fn => fn.repositories || [])
      .flat()
      .map(repo => ({
        ...repo,
        title: repo.repo_name
      }));
    
    return deduplicateWithFallback(functionRepos);
  }, [garden.modal_functions]);

  const findFunctionsWithMaterial = useCallback((identifier: string): ModalFunction[] => {
    return (garden.modal_functions || [])
      .filter(fn => fn.repositories?.some(repo => 
        repo.doi === identifier || (!repo.doi && repo.url === identifier)
      ))
      .map(fn => ({
        ...fn,
        already_has_material: true
      }));
  }, [garden.modal_functions]);

  const refreshMaterials = useCallback(async () => {
    await contextRefreshMaterials();
  }, [contextRefreshMaterials]);

  return { materials, findFunctionsWithMaterial, refreshMaterials };
};

export const useNotebookManagement = (garden: Garden): MaterialManagementHook<Notebook> => {
  const { refreshMaterials: contextRefreshMaterials } = useMaterialsContext();
  
  const materials = useMemo(() => {
    const functionNotebooks = (garden.modal_functions || [])
      .map(fn => fn.notebooks || [])
      .flat();
    
    return deduplicateWithFallback(functionNotebooks);
  }, [garden.modal_functions]);

  const findFunctionsWithMaterial = useCallback((identifier: string): ModalFunction[] => {
    return (garden.modal_functions || [])
      .filter(fn => fn.notebooks?.some(notebook => 
        notebook.doi === identifier || (!notebook.doi && notebook.url === identifier)
      ))
      .map(fn => ({
        ...fn,
        already_has_material: true
      }));
  }, [garden.modal_functions]);

  const refreshMaterials = useCallback(async () => {
    await contextRefreshMaterials();
  }, [contextRefreshMaterials]);

  return { materials, findFunctionsWithMaterial, refreshMaterials };
}; 