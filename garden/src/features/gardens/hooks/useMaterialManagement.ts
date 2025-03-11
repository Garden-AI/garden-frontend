import { useMemo, useCallback } from 'react';
import { Dataset, Paper, Repository, Notebook } from '@/types';
import { ExtendedGarden, ModalFunctionWithOwner } from '@/types/garden.types';
import { useMaterialsContext } from '../contexts/MaterialsContext';
import type { MaterialWithDOI } from '@/types/garden.types';

interface MaterialManagementHook<T> {
  materials: T[];
  refreshMaterials: () => Promise<void>;
  findFunctionsWithMaterial: (doi: string) => ModalFunctionWithOwner[];
}

export const useMaterialManagement = <T extends MaterialWithDOI>(
  garden: ExtendedGarden,
  getMaterialsFromEntrypoint: (entrypoint: NonNullable<ExtendedGarden['entrypoints']>[number]) => T[],
  getMaterialsFromFunction: (func: NonNullable<ExtendedGarden['modal_functions']>[number]) => T[],
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

// Type-specific hooks
export const useDatasetManagement = (garden: ExtendedGarden): MaterialManagementHook<Dataset> => {
  const materials = useMemo(() => garden.datasets || [], [garden.datasets]);

  const findFunctionsWithMaterial = useCallback((doi: string): ModalFunctionWithOwner[] => {
    return (garden.modal_functions || []).filter(fn => 
      fn.datasets?.some(dataset => dataset.doi === doi)
    ).map(fn => ({
      ...fn,
      owner_identity_id: fn.owner_identity_id,
      already_has_material: true
    }));
  }, [garden.modal_functions]);

  const refreshMaterials = useCallback(async () => {
    return Promise.resolve();
  }, []);

  return { materials, findFunctionsWithMaterial, refreshMaterials };
};

export const usePaperManagement = (garden: ExtendedGarden): MaterialManagementHook<Paper & { title: string }> => {
  const materials = useMemo(() => 
    (garden.papers || []).map(paper => ({
      ...paper,
      title: paper.title || 'Untitled Paper'
    }))
  , [garden.papers]);

  const findFunctionsWithMaterial = useCallback((doi: string): ModalFunctionWithOwner[] => {
    return (garden.modal_functions || []).filter(fn => 
      fn.papers?.some(paper => paper.doi === doi)
    ).map(fn => ({
      ...fn,
      owner_identity_id: fn.owner_identity_id,
      already_has_material: true
    }));
  }, [garden.modal_functions]);

  const refreshMaterials = useCallback(async () => {
    return Promise.resolve();
  }, []);

  return { materials, findFunctionsWithMaterial, refreshMaterials };
};

export const useRepositoryManagement = (garden: ExtendedGarden): MaterialManagementHook<Repository & { title: string }> => {
  const materials = useMemo(() => 
    (garden.repositories || []).map(repo => ({
      ...repo,
      title: repo.repo_name
    }))
  , [garden.repositories]);

  const findFunctionsWithMaterial = useCallback((doi: string): ModalFunctionWithOwner[] => {
    return (garden.modal_functions || []).filter(fn => 
      fn.repositories?.some(repo => repo.url === doi)
    ).map(fn => ({
      ...fn,
      owner_identity_id: fn.owner_identity_id,
      already_has_material: true
    }));
  }, [garden.modal_functions]);

  const refreshMaterials = useCallback(async () => {
    return Promise.resolve();
  }, []);

  return { materials, findFunctionsWithMaterial, refreshMaterials };
};

export const useNotebookManagement = (garden: ExtendedGarden): MaterialManagementHook<Notebook> => {
  const materials = useMemo(() => garden.notebooks || [], [garden.notebooks]);

  const findFunctionsWithMaterial = useCallback((doi: string): ModalFunctionWithOwner[] => {
    return (garden.modal_functions || []).filter(fn => 
      fn.notebooks?.some(notebook => notebook.url === doi)
    ).map(fn => ({
      ...fn,
      owner_identity_id: fn.owner_identity_id,
      already_has_material: true
    }));
  }, [garden.modal_functions]);

  const refreshMaterials = useCallback(async () => {
    // Implement refresh logic if needed
    return Promise.resolve();
  }, []);

  return { materials, findFunctionsWithMaterial, refreshMaterials };
}; 