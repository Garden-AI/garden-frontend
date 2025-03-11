import { Dataset, Garden, GardenPatchRequest, Paper, Repository, ModalFunction, Notebook } from ".";

// Base interface for materials with DOI
export interface MaterialWithDOI {
  doi?: string;
  title: string;
  [key: string]: any;
}

export interface MaterialWithURL extends MaterialWithDOI {
  url?: string;
}

export interface MaterialsProviderProps {
  children: React.ReactNode;
  garden: Garden;
  refetchGarden: () => Promise<void>;
}

export interface MaterialsContextType {
  allMaterials: {
    datasets: Dataset[];
    papers: Paper[];
    repositories: Repository[];
    notebooks: Notebook[];
  };
  findFunctionsWithMaterial: (doi: string) => ModalFunction[];
  refreshMaterials: () => Promise<void>;
} 