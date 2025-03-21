import { useMemo, useCallback } from 'react';
import { Dataset, Paper, Repository, Notebook, ModalFunction } from '@/types';
import { useQueryClient } from '@tanstack/react-query';

interface MaterialsResult {
  datasets: Dataset[];
  papers: Paper[];
  repositories: Repository[];
  notebooks: Notebook[];
}

export const useModalFunctionMaterials = (modalFunction: ModalFunction): MaterialsResult => {
  const queryClient = useQueryClient();
  
  // Extract all materials from the modal function
  const materials = useMemo(() => {
    return {
      datasets: modalFunction.datasets || [],
      papers: modalFunction.papers || [],
      repositories: modalFunction.repositories || [],
      notebooks: modalFunction.notebooks || []
    };
  }, [modalFunction]);

  return materials;
}; 