import { FormSchemaType } from "./FormSchema";
import { GardenCreateRequest } from "./RequestSchema";

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
    entrypoint_ids: formData.entrypoint_ids?.map(
      (entrypoint) => entrypoint.doi,
    ),
    doi,
    owner_identity_id: ownerId,
  };
}
