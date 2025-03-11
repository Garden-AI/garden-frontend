import { Dataset, Garden, GardenPatchRequest, Paper, Repository, ModalFunction, Notebook } from ".";

// Extend the GardenPatchRequest type to include datasets, papers, and repositories
export interface ExtendedGardenPatchRequest extends GardenPatchRequest {
  datasets?: Dataset[] | null;
  papers?: Paper[] | null;
  repositories?: Repository[] | null;
  notebooks?: Notebook[] | null;
}

// Extend the Garden type to include datasets, papers, and repositories
export interface ExtendedGarden extends Garden {
  datasets?: Dataset[];
  papers?: Paper[];
  repositories?: Repository[];
  notebooks?: Notebook[];
  current_user_id?: string; // ID of the currently authenticated user
  entrypoints?: {
    datasets?: Dataset[];
    papers?: Paper[];
    repositories?: Repository[];
    notebooks?: Notebook[];
  }[];
  modal_functions?: (ModalFunction & {
    datasets?: Dataset[];
    papers?: Paper[];
    repositories?: Repository[];
    notebooks?: Notebook[];
    owner_identity_id: string;
  })[];
}

export interface MaterialWithDOI {
  doi?: string | null;
  title: string;
  [key: string]: any;
}

export interface MaterialWithURL extends MaterialWithDOI {
  url?: string | null;
}

export interface MaterialsContextType {
  refreshMaterials: () => Promise<void>;
  findFunctionsWithMaterial: (doi: string) => ModalFunction[];
}

export interface MaterialsProviderProps {
  children: React.ReactNode;
  garden: ExtendedGarden;
  refetchGarden: () => Promise<void>;
}

export interface MaterialManagementHook<T extends MaterialWithDOI> {
  materials: T[];
  refreshMaterials: () => Promise<void>;
  findFunctionsWithMaterial: (doi: string) => ModalFunction[];
} 