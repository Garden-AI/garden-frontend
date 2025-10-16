// Components
export { default as AddMaterialWithFunctionSelect } from './components/AddMaterialWithFunctionSelect';

export { default as AssociatedMaterials } from './components/AssociatedMaterials';
export { AssociatedMaterialsGrid } from './components/AssociatedMaterialsGrid';
export { AssociatedMaterialsSection } from './components/AssociatedMaterialsSection';

// Cards
export * from "./components/cards/MaterialCards";
export { MaterialCardWithRemoval } from './components/cards/MaterialCardWithRemoval';

// Utils
export * from './utils/arxiv';
export * from './utils/github';
export * from './utils/zenodo';

// Hooks
export { useMaterialOperations } from './hooks/useMaterialOperations';
export { useMaterialsManager } from './hooks/useMaterialsManager';
export { useModalFunctionMaterials } from './hooks/useModalFunctionMaterials';
export { useMaterialActions } from './hooks/useMaterialActions';
export { useMaterialManagement } from './hooks/useMaterialManagement';

// Types
export * from './types/material.types';

// Contexts
export { useMaterialsContext, MaterialsProvider } from './contexts/MaterialsContext';
