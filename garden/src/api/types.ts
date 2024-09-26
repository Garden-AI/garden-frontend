import type { components } from "./backend-schema";

type Garden = components["schemas"]["GardenMetadataResponse"];
type GardenCreateRequest = components["schemas"]["GardenCreateRequest"];
type GardenCreateResponse = components["schemas"]["GardenMetadataResponse"];
type GardenPatchRequest = components["schemas"]["GardenPatchRequest"];
type Entrypoint = components["schemas"]["EntrypointMetadataResponse"];
type EntrypointCreateRequest = components["schemas"]["EntrypointCreateRequest"];
type EntrypointPatchRequest = components["schemas"]["EntrypointPatchRequest"];

type User = components["schemas"]["UserMetadataResponse"];
type UpdateUserSchema = components["schemas"]["UserUpdateRequest"];

type Dataset = components["schemas"]["_DatasetMetadata-Output"];
type Paper = components["schemas"]["_Paper"];
type Repository = components["schemas"]["_Repository"];
// type Notebook = components["schemas"]["_RegisteredNotebook"];

type DOIRequest = components["schemas"]["Doi"];

// Temporary until backend schema is merged
interface GardenSearchFilter {
  field_name: string;
  values: string[];
}

interface Facets {
  tags: Record<string, number>;
  authors: Record<string, number>;
  year: Record<string, number>;
}

interface GardenSearchRequest {
  q: string;
  limit?: number;
  offset?: number;
  filters?: GardenSearchFilter[];
}

interface GardenSearchResponse {
  count: number;
  total: number;
  offset: number;
  garden_meta: Garden[];
  facets: Facets;
}

export type {
  Garden,
  GardenCreateRequest,
  GardenCreateResponse,
  GardenPatchRequest,
  Entrypoint,
  EntrypointCreateRequest,
  EntrypointPatchRequest,
  User,
  UpdateUserSchema,
  Dataset,
  Paper,
  Repository,
  DOIRequest,
  GardenSearchRequest,
  GardenSearchResponse,
  Facets,
  GardenSearchFilter,
};
