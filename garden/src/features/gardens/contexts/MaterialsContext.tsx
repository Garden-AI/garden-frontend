import { createContext, useContext, ReactNode, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ModalFunction } from '@/types';
import { ExtendedGarden, MaterialsContextType, MaterialsProviderProps } from '@/types/garden.types';
import { QueryClient } from '@tanstack/react-query';

const MaterialsContext = createContext<MaterialsContextType | undefined>(undefined);

export const useMaterialsContext = () => {
  const context = useContext(MaterialsContext);
  if (context === undefined) {
    throw new Error('useMaterialsContext must be used within a MaterialsProvider');
  }
  return context;
};

export const MaterialsProvider = ({ children, garden, refetchGarden }: MaterialsProviderProps) => {
  const queryClient = useQueryClient();

  const refreshMaterials = useCallback(async () => {
    // Invalidate function caches
    if (garden.modal_functions) {
      garden.modal_functions.forEach(func => {
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
    if (!garden.doi) return [];
    
    // CRITICAL FIX: Try to get fresh data from the query cache if available
    const latestGardenData = queryClient.getQueryData(["garden", garden.doi]) as ExtendedGarden | undefined;
    
    // Use a fresh copy of the functions array from the latest data or fallback to garden prop
    const currentFunctions = [...(latestGardenData?.modal_functions || garden.modal_functions || [])];
    
    // More robust filtering with null/undefined checks
    return currentFunctions.filter((func: ModalFunction & { datasets?: any[]; papers?: any[]; repositories?: any[] }) => {
      // Check datasets with safety checks
      const hasMaterialInDataset = Array.isArray(func.datasets) && 
        func.datasets.some(dataset => dataset && dataset.doi === doi);
      
      // Check papers with safety checks
      const hasMaterialInPaper = Array.isArray(func.papers) && 
        func.papers.some(paper => paper && paper.doi === doi);
      
      // Check repositories with safety checks
      const hasMaterialInRepo = Array.isArray(func.repositories) && 
        func.repositories.some(repo => repo && repo.doi === doi);
      
      return hasMaterialInDataset || hasMaterialInPaper || hasMaterialInRepo;
    });
  }, [garden.doi, garden.modal_functions, queryClient]);

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