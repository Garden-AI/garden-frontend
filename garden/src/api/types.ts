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

// type Notebook = components["schemas"]["_RegisteredNotebook"];

type DOIRequest = components["schemas"]["Doi"];

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
  DOIRequest,
};
