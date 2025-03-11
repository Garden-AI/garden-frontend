import { Dataset, Garden, GardenPatchRequest, Paper, Repository, ModalFunction, Notebook } from ".";

// Define ModalFunctionWithOwner type
export interface ModalFunctionWithOwner extends ModalFunction {
  owner_identity_id: string;
  already_has_material?: boolean;
}

// Base interface for materials with DOI
export interface MaterialWithDOI {
  doi?: string | null;
  title: string;
  [key: string]: any;
}

// Extend the GardenPatchRequest type to include datasets, papers, and repositories
export interface ExtendedGardenPatchRequest extends GardenPatchRequest {
  datasets?: Dataset[] | null;
  papers?: Paper[] | null;
  repositories?: Repository[] | null;
  notebooks?: Notebook[] | null;
}

// Define the Entrypoint type with required fields
export interface Entrypoint {
  is_archived: boolean;
  function_text: string;
  title: string;
  description: string | null;
  year: string;
  authors?: string[];
  tags?: string[];
  test_functions?: string[];
  doi: string;
  doi_is_draft: boolean;
  func_uuid: string;
  container_uuid: string;
  modal_app_id: number;
  base_image_uri: string;
  full_image_uri: string;
  notebook_url: string;
  owner_identity_id: string;
  id: number;
  datasets?: Dataset[];
  papers?: Paper[];
  repositories?: Repository[];
  notebooks?: Notebook[];
}

// Define the ExtendedModalFunction type
export interface ExtendedModalFunction extends ModalFunction {
  datasets?: Dataset[];
  papers?: Paper[];
  repositories?: Repository[];
  notebooks?: Notebook[];
  owner_identity_id: string;
}

// Here's the key change - use Omit to properly redefine incompatible properties
export interface ExtendedGarden extends Omit<Garden, 'entrypoints' | 'modal_functions'> {
  datasets?: Dataset[];
  papers?: Paper[];
  repositories?: Repository[];
  notebooks?: Notebook[];
  current_user_id?: string;
  entrypoints?: Entrypoint[];
  modal_functions?: ExtendedModalFunction[];
}

export interface MaterialWithURL extends MaterialWithDOI {
  url?: string | null;
}

export interface MaterialsProviderProps {
  children: React.ReactNode;
  garden: ExtendedGarden;
  refetchGarden: () => Promise<void>;
}

export interface MaterialsContextType {
  allMaterials: {
    datasets: Dataset[];
    papers: Paper[];
    repositories: Repository[];
    notebooks: Notebook[];
  };
  findFunctionsWithMaterial: (doi: string) => ModalFunctionWithOwner[];
  refreshMaterials: () => Promise<void>;
} 