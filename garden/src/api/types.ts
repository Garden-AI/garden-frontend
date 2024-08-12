import type { components } from "./backend-schema";

type Garden = components["schemas"]["GardenMetadataResponse"];
type GardenCreateRequest = components["schemas"]["GardenCreateRequest"];
type GardenCreateResponse = components["schemas"]["GardenMetadataResponse"];
type Entrypoint = components["schemas"]["EntrypointMetadataResponse"];
type EntrypointCreateRequest = components["schemas"]["EntrypointCreateRequest"];

type User = components["schemas"]["UserMetadataResponse"];
type UpdateUserSchema = components["schemas"]["UserUpdateRequest"];

// type Notebook = components["schemas"]["_RegisteredNotebook"];

type UpdateDOIRequest = components["schemas"]["Doi"];

export type {
  Garden,
  GardenCreateRequest,
  GardenCreateResponse,
  Entrypoint,
  EntrypointCreateRequest,
  User,
  UpdateUserSchema,
  UpdateDOIRequest,
};
