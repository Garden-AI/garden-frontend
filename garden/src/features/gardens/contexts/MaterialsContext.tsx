import { createContext, useContext, ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ModalFunction } from '@/types';
import { ExtendedGarden, MaterialsContextType, MaterialsProviderProps } from '@/types/garden.types';
import { useMaterialsManager } from '../hooks/useMaterialsManager';

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
  const { allMaterials, findFunctionsWithMaterial, refreshMaterials } = useMaterialsManager({
    garden,
    queryClient,
    refetchGarden,
  });

  return (
    <MaterialsContext.Provider
      value={{
        refreshMaterials,
        findFunctionsWithMaterial,
      }}
    >
      {children}
    </MaterialsContext.Provider>
  );
}; 