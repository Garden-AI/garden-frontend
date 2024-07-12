import { FormSchemaType, GardenCreateRequest } from "./FormSchema";

export function transformFormToRequest(
  formData: FormSchemaType,
  doi: string,
  ownerId: string,
): GardenCreateRequest {
  return {
    ...formData,
    tags: formData.tags?.map((tag) => tag.label),
    authors: formData.authors?.map((author) => author.label),
    contributors: formData.contributors?.map(
      (contributor) => contributor.label,
    ),

    entrypoint_ids: formData.entrypointIds?.map((entrypoint) => entrypoint.doi),
    doi,
    owner_identity_id: ownerId,
  };
}
