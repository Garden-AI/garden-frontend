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

export const useDatasetManagement = (garden: Garden): MaterialManagementHook<Dataset> => {
  const { refreshMaterials: contextRefreshMaterials } = useMaterialsContext();
  
  const materials = useMemo(() => {
    const functionDatasets = (garden.modal_functions || [])
      .map(fn => fn.datasets || [])
      .flat();
    
    return functionDatasets.filter((dataset, index, self) => {
      if (!dataset.doi) return true;
      return index === self.findIndex(d => d.doi === dataset.doi);
    });
  }, [garden.modal_functions]);

  const findFunctionsWithMaterial = useCallback((doi: string): ModalFunction[] => {
    return (garden.modal_functions || [])
      .filter(fn => fn.datasets?.some(dataset => dataset.doi === doi))
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
    
    return functionPapers.filter((paper, index, self) => {
      if (!paper.doi) return true;
      return index === self.findIndex(p => p.doi === paper.doi);
    });
  }, [garden.modal_functions]);

  const findFunctionsWithMaterial = useCallback((doi: string): ModalFunction[] => {
    return (garden.modal_functions || [])
      .filter(fn => fn.papers?.some(paper => paper.doi === doi))
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
    
    return functionRepos.filter((repo, index, self) => {
      if (!repo.url) return true;
      return index === self.findIndex(r => r.url === repo.url);
    });
  }, [garden.modal_functions]);

  const findFunctionsWithMaterial = useCallback((url: string): ModalFunction[] => {
    return (garden.modal_functions || [])
      .filter(fn => fn.repositories?.some(repo => repo.url === url))
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
    
    return functionNotebooks.filter((notebook, index, self) => {
      if (!notebook.url) return true;
      return index === self.findIndex(n => n.url === notebook.url);
    });
  }, [garden.modal_functions]);

  const findFunctionsWithMaterial = useCallback((doi: string): ModalFunction[] => {
    return (garden.modal_functions || [])
      .filter(fn => fn.notebooks?.some(notebook => notebook.url === doi))
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