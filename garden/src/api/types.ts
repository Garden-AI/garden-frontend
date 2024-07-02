import type { paths, components } from "./backend-schema";

type Garden = components["schemas"]["GardenMetadataResponse"];
type GardenCreateRequest = components["schemas"]["GardenCreateRequest"];

type Entrypoint = components["schemas"]["EntrypointMetadata"];
type EntrypointCreateRequest = components["schemas"]["EntrypointCreateRequest"];

export type {
  Garden,
  GardenCreateRequest,
  Entrypoint,
  EntrypointCreateRequest,
};
