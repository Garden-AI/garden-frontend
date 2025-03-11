import { createContext, useContext, ReactNode, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ModalFunction } from '@/types';
import { ExtendedGarden, MaterialsContextType, MaterialsProviderProps } from '@/types/garden.types';

const MaterialsContext = createContext<MaterialsContextType | undefined>(undefined);

export const useMaterialsContext = () => {
  const context = useContext(MaterialsContext);
  if (!context) {
    throw new Error('useMaterialsContext must be used within a MaterialsProvider');
  }
  return context;
};

export const MaterialsProvider = ({ children, garden, refetchGarden }: MaterialsProviderProps) => {
  const queryClient = useQueryClient();

  const refreshMaterials = useCallback(async () => {
    // Invalidate any cached modal functions
    if (garden?.modal_functions) {
      garden.modal_functions.forEach((func: ModalFunction) => {
        if (func.id) {
          queryClient.invalidateQueries({ queryKey: ["modalFunction", func.id.toString()] });
        }
      });
    }
    
    // Invalidate the garden query
    queryClient.invalidateQueries({ queryKey: ["garden", garden.doi] });
    
    // Refetch garden data
    await refetchGarden();
  }, [garden, queryClient, refetchGarden]);

  const findFunctionsWithMaterial = useCallback((doi: string): ModalFunction[] => {
    if (!garden.modal_functions) return [];
    
    return garden.modal_functions.filter((func: ModalFunction & { datasets?: any[]; papers?: any[]; repositories?: any[] }) => {
      const hasMaterialInDataset = func.datasets?.some(dataset => dataset.doi === doi);
      const hasMaterialInPaper = func.papers?.some(paper => paper.doi === doi);
      const hasMaterialInRepo = func.repositories?.some(repo => repo.doi === doi);
      
      return hasMaterialInDataset || hasMaterialInPaper || hasMaterialInRepo;
    });
  }, [garden.modal_functions]);

  const value = {
    refreshMaterials,
    findFunctionsWithMaterial,
  };

  return (
    <MaterialsContext.Provider value={value}>
      {children}
    </MaterialsContext.Provider>
  );
}; 