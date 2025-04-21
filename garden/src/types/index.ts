import type { components } from "./backend-schema";

type Garden = components["schemas"]["GardenMetadataResponse"];
type GardenCreateRequest = components["schemas"]["GardenCreateRequest"];
type GardenCreateResponse = components["schemas"]["GardenMetadataResponse"];
type GardenPatchRequest = components["schemas"]["GardenPatchRequest"];

type Entrypoint = components["schemas"]["EntrypointMetadataResponse"];
type EntrypointCreateRequest = components["schemas"]["EntrypointCreateRequest"];
type EntrypointPatchRequest = components["schemas"]["EntrypointPatchRequest"];

type ModalAppCreateRequest = components["schemas"]["ModalAppCreateRequest"];
type ModalAppPatchRequest = components["schemas"]["ModalAppPatchRequest"]
type ModalAppMetadataResponse = components["schemas"]["ModalAppMetadataResponse"];
type BaseModalFunction = components["schemas"]["ModalFunctionMetadataResponse"];

// Extended interface for UI-specific properties
interface ModalFunction extends BaseModalFunction {
  already_has_material?: boolean;
  contributors?: string[];
}

type ModalFunctionPatchRequest = components["schemas"]["ModalFunctionPatchRequest"] & {
  contributors?: string[] | null;
};

type AsyncModalAppMetadataResponse = components["schemas"]["AsyncModalAppMetadataResponse"];
type AsyncModalJobStatus = components["schemas"]["AsyncModalJobStatus"];

type ModalFileMetadataRequest = components["schemas"]["ModalFileMetadataRequest"];
type ModalFileMetadataResponse = components["schemas"]["ModalFileMetadataResponse"];

type User = components["schemas"]["UserMetadataResponse"];
type UpdateUserSchema = components["schemas"]["UserUpdateRequest"];

type Dataset = components["schemas"]["_DatasetMetadata"];
type Paper = components["schemas"]["_PaperMetadata"];
type Repository = components["schemas"]["_RepositoryMetadata"];
type Model = components["schemas"]["_ModelMetadata"];
type Notebook = components["schemas"]["_NotebookMetadata"];

type DOIRequest = components["schemas"]["Doi"];

type GardenSearchRequest = components["schemas"]["GardenSearchRequest"];
type GardenSearchResponse = components["schemas"]["GardenSearchResponse"];
type GardenSearchFacets = components["schemas"]["GardenSearchFacets"];
type GardenSearchFilter = components["schemas"]["GardenSearchFilter"];

export type {
  Garden,
  GardenCreateRequest,
  GardenCreateResponse,
  GardenPatchRequest,
  Entrypoint,
  EntrypointCreateRequest,
  EntrypointPatchRequest,
  ModalAppCreateRequest,
  ModalAppMetadataResponse,
  User,
  UpdateUserSchema,
  Dataset,
  Paper,
  Repository,
  DOIRequest,
  GardenSearchRequest,
  GardenSearchResponse,
  GardenSearchFacets,
  GardenSearchFilter,
  AsyncModalAppMetadataResponse,
  AsyncModalJobStatus,
  ModalFileMetadataRequest,
  ModalFileMetadataResponse,
  ModalAppPatchRequest,
  Model,
  Notebook
};

export type { ModalFunction, ModalFunctionPatchRequest };
