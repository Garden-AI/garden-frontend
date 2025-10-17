import { useMemo, useCallback } from 'react';
import { Garden, Dataset, Paper, Repository, Notebook, GardenFunction, ModalFunction, HpcFunction } from '@/types';

function deduplicateWithFallback<T extends { doi?: string | null; url?: string | null }>(items: T[]): T[] {
  const seen = new Set<string>();
  const result: T[] = [];

  for (const item of items) {
    const identifier = item.doi || item.url;
    if (identifier && !seen.has(identifier)) {
      seen.add(identifier);
      result.push(item);
    } else if (!identifier && !seen.has(JSON.stringify(item))) {
      seen.add(JSON.stringify(item));
      result.push(item);
    }
  }
  return result;
}

/**
 * Aggregates and deduplicates materials from all functions in a garden.
 *
 * This hook computes materials lists directly from the garden object,
 * combining materials from BOTH modal functions AND HPC functions.
 * It does NOT use React Context - the garden query cache is the source of truth.
 *
 * Deduplication:
 * - Papers/Datasets: by DOI (if present), otherwise by URL
 * - Repositories: by URL (DOI used if present)
 * - Notebooks: by URL (DOI used if present)
 *
 * Find functions:
 * - Returns GardenFunction[] (discriminated union of Modal | HPC)
 * - Includes functionType field to distinguish between types
 *
 * @param garden - The garden object containing modal_functions and hpc_functions with materials
 * @returns Deduplicated materials arrays and functions to find which functions use a material
 */
export const useGardenMaterials = (garden: Garden) => {
  const modalFunctions = garden.modal_functions || [];
  const hpcFunctions = garden.hpc_functions || [];

  const datasets = useMemo(() => {
    const allDatasets = [
      ...modalFunctions.flatMap(fn => fn.datasets || []),
      ...hpcFunctions.flatMap(fn => fn.datasets || []),
    ];
    return deduplicateWithFallback(allDatasets);
  }, [modalFunctions, hpcFunctions]);

  const papers = useMemo(() => {
    const allPapers = [
      ...modalFunctions.flatMap(fn => fn.papers || []),
      ...hpcFunctions.flatMap(fn => fn.papers || []),
    ];
    return deduplicateWithFallback(allPapers);
  }, [modalFunctions, hpcFunctions]);

  const repositories = useMemo(() => {
    const allRepositories = [
      ...modalFunctions.flatMap(fn => fn.repositories || []),
      ...hpcFunctions.flatMap(fn => fn.repositories || []),
    ];
    return deduplicateWithFallback(allRepositories);
  }, [modalFunctions, hpcFunctions]);

  const notebooks = useMemo(() => {
    const allNotebooks = [
      ...modalFunctions.flatMap(fn => fn.notebooks || []),
      ...hpcFunctions.flatMap(fn => fn.notebooks || []),
    ];
    return deduplicateWithFallback(allNotebooks);
  }, [modalFunctions, hpcFunctions]);

  const findDatasetsInFunctions = useCallback((identifier: string): GardenFunction[] => {
    const modalFns = modalFunctions
      .filter(fn => fn.datasets?.some(d => d.doi === identifier || d.url === identifier))
      .map(fn => ({ ...fn, functionType: 'modal' as const }));

    const hpcFns = hpcFunctions
      .filter(fn => fn.datasets?.some(d => d.doi === identifier || d.url === identifier))
      .map(fn => ({ ...fn, functionType: 'hpc' as const }));

    return [...modalFns, ...hpcFns];
  }, [modalFunctions, hpcFunctions]);

  const findPapersInFunctions = useCallback((identifier: string): GardenFunction[] => {
    const modalFns = modalFunctions
      .filter(fn => fn.papers?.some(p => p.doi === identifier || p.url === identifier))
      .map(fn => ({ ...fn, functionType: 'modal' as const }));

    const hpcFns = hpcFunctions
      .filter(fn => fn.papers?.some(p => p.doi === identifier || p.url === identifier))
      .map(fn => ({ ...fn, functionType: 'hpc' as const }));

    return [...modalFns, ...hpcFns];
  }, [modalFunctions, hpcFunctions]);

  const findRepositoriesInFunctions = useCallback((identifier: string): GardenFunction[] => {
    const modalFns = modalFunctions
      .filter(fn => fn.repositories?.some(r => r.url === identifier))
      .map(fn => ({ ...fn, functionType: 'modal' as const }));

    const hpcFns = hpcFunctions
      .filter(fn => fn.repositories?.some(r => r.url === identifier))
      .map(fn => ({ ...fn, functionType: 'hpc' as const }));

    return [...modalFns, ...hpcFns];
  }, [modalFunctions, hpcFunctions]);

  const findNotebooksInFunctions = useCallback((identifier: string): GardenFunction[] => {
    const modalFns = modalFunctions
      .filter(fn => fn.notebooks?.some(n => n.url === identifier))
      .map(fn => ({ ...fn, functionType: 'modal' as const }));

    const hpcFns = hpcFunctions
      .filter(fn => fn.notebooks?.some(n => n.url === identifier))
      .map(fn => ({ ...fn, functionType: 'hpc' as const }));

    return [...modalFns, ...hpcFns];
  }, [modalFunctions, hpcFunctions]);

  return {
    datasets,
    papers,
    repositories,
    notebooks,
    findDatasetsInFunctions,
    findPapersInFunctions,
    findRepositoriesInFunctions,
    findNotebooksInFunctions,
  };
};
