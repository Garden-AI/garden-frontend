import type { paths, components } from "./backend-schema";

type Garden = components["schemas"]["GardenMetadataResponse"];
type GardenCreateRequest = components["schemas"]["GardenCreateRequest"];
type GardenCreateResponse = components["schemas"]["GardenMetadataResponse"];
type Entrypoint = components["schemas"]["EntrypointMetadataResponse"];
type EntrypointCreateRequest = components["schemas"]["EntrypointCreateRequest"];
type EntrypointPatchRequest = components["schemas"]["EntrypointPatchRequest"];

type User = components["schemas"]["UserMetadataResponse"];
type UpdateUserSchema = components["schemas"]["UserUpdateRequest"];

type Dataset = components["schemas"]["_DatasetMetadata-Output"];
type Paper = components["schemas"]["_Paper"];
type Repository = components["schemas"]["_Repository"];
// type Notebook = components["schemas"]["_RegisteredNotebook"];

export type {
  Garden,
  GardenCreateRequest,
  GardenCreateResponse,
  Entrypoint,
  EntrypointCreateRequest,
  EntrypointPatchRequest,
  User,
  UpdateUserSchema,
  Dataset,
  Paper,
  Repository,
};
