import type { paths, components } from "./backend-schema";

type Garden = components["schemas"]["_PublishedGarden"];
type GardenCreateRequest = components["schemas"]["GardenCreateRequest"];
type GardenCreateResponse = components["schemas"]["GardenMetadataResponse"];

type Entrypoint = components["schemas"]["_RegisteredEntrypoint"];
type EntrypointCreateRequest = components["schemas"]["EntrypointCreateRequest"];

// type Notebook = components["schemas"]["_RegisteredNotebook"];

export type {
  Garden,
  GardenCreateRequest,
  GardenCreateResponse,
  Entrypoint,
  EntrypointCreateRequest,
};
