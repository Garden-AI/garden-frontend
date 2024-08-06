import type { paths, components } from "./backend-schema";

type Garden = components["schemas"]["GardenMetadataResponse"];
type GardenCreateRequest = components["schemas"]["GardenCreateRequest"];
type GardenCreateResponse = components["schemas"]["GardenMetadataResponse"];
type Entrypoint = components["schemas"]["EntrypointMetadataResponse"];
type EntrypointCreateRequest = components["schemas"]["EntrypointCreateRequest"];

// type Notebook = components["schemas"]["_RegisteredNotebook"];

export type {
  Garden,
  GardenCreateRequest,
  GardenCreateResponse,
  Entrypoint,
  EntrypointCreateRequest,
};
