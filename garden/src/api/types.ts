import type { components } from "./backend-schema";

type Garden = components["schemas"]["GardenMetadataResponse"];
type GardenCreateRequest = components["schemas"]["GardenCreateRequest"];
type GardenCreateResponse = components["schemas"]["GardenMetadataResponse"];
type GardenPatchRequest = components["schemas"]["GardenPatchRequest"];

type Entrypoint = components["schemas"]["EntrypointMetadataResponse"];
type EntrypointCreateRequest = components["schemas"]["EntrypointCreateRequest"];
type EntrypointPatchRequest = components["schemas"]["EntrypointPatchRequest"];

type ModalAppCreateRequest = components["schemas"]["ModalAppCreateRequest"];
type ModalAppMetadataResponse = components["schemas"]["ModalAppMetadataResponse"];
type ModalFunction = components["schemas"]["ModalFunctionMetadata"];

type User = components["schemas"]["UserMetadataResponse"];
type UpdateUserSchema = components["schemas"]["UserUpdateRequest"];

type Dataset = components["schemas"]["_DatasetMetadata-Output"];
type Paper = components["schemas"]["_Paper"];
type Repository = components["schemas"]["_Repository"];
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
  ModalAppCreateRequest,
  ModalAppMetadataResponse,
  ModalFunction,
  User,
  UpdateUserSchema,
  Dataset,
  Paper,
  Repository,
  DOIRequest,
};
