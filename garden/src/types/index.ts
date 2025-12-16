import type { components } from "./backend-schema";

type Garden = components["schemas"]["GardenMetadataResponse"];
type GardenMetadataResponse = components["schemas"]["GardenMetadataResponse"];
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

// Extended type for UI-specific properties
type ModalFunction = BaseModalFunction & {
  already_has_material?: boolean;
  contributors?: string[];
  functionType: 'modal'; // Add discriminator
}

type ModalFunctionPatchRequest = components["schemas"]["ModalFunctionPatchRequest"] & {
  contributors?: string[] | null;
};

type ModalInvocationRequest = components["schemas"]["ModalInvocationRequest"]
type ModalInvocationOutputsResponse = components["schemas"]["ModalInvocationOutputsResponse"]

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

// Remove or comment out the incorrect DOIRequest type
// type DOIRequest = components["schemas"]["Doi"];
type DOIRequest = any; // Temporarily use any until correct type is identified

type GardenSearchRequest = components["schemas"]["GardenSearchRequest"];
type GardenSearchResponse = components["schemas"]["GardenSearchResponse"];
type GardenSearchFacets = components["schemas"]["GardenSearchFacets"];
type GardenSearchFilter = Omit<components["schemas"]["GardenSearchFilter"], 'operation'> & {
  operation?: components["schemas"]["GardenSearchFilter"]['operation'];
};
type GardenSearchMetadataResponse = components["schemas"]["GardenSearchMetadataResponse"];

// Note: Benchmark types are now managed in src/features/benchmarks/

type HpcEndpointCreateRequest = components["schemas"]["HpcEndpointCreateRequest"];
type HpcEndpointResponse = components["schemas"]["HpcEndpointResponse"];
type HpcEndpointInfo = components["schemas"]["HpcEndpointInfo"];
type HpcFunctionCreateRequest = components["schemas"]["HpcFunctionCreateRequest"];
type HpcFunctionMetadataResponse = components["schemas"]["HpcFunctionMetadataResponse"];
type HpcFunctionPatchRequest = components["schemas"]["HpcFunctionPatchRequest"];
type HpcInvocationCreateRequest = components["schemas"]["HpcInvocationCreateRequest"];
type HpcInvocationResponse = components["schemas"]["HpcInvocationResponse"];

type HpcFunction = HpcFunctionMetadataResponse & { functionType: 'hpc' };
type GardenFunction = ModalFunction | HpcFunction;

export type {
  Garden,
  GardenMetadataResponse,
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
  GardenSearchMetadataResponse,
  AsyncModalAppMetadataResponse,
  AsyncModalJobStatus,
  ModalFileMetadataRequest,
  ModalFileMetadataResponse,
  ModalAppPatchRequest,
  ModalFunction,
  ModalFunctionPatchRequest,
  ModalInvocationRequest,
  ModalInvocationOutputsResponse,
  Model,
  Notebook,
  HpcEndpointCreateRequest,
  HpcEndpointResponse,
  HpcEndpointInfo,
  HpcFunctionCreateRequest,
  HpcFunctionMetadataResponse,
  HpcFunctionPatchRequest,
  HpcInvocationCreateRequest,
  HpcInvocationResponse,
  HpcFunction,
  GardenFunction,
  // BenchmarkResult, // Remove this line to avoid duplicate export
};


