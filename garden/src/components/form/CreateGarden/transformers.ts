import { GardenCreateRequest } from "@/api/types";
import { GardenCreateFormData } from "./schemas";

export function transformFormToRequest(
  formData: GardenCreateFormData,
  doi: string,
  ownerId: string,
): GardenCreateRequest {
  return {
    ...formData,
    authors: formData.authors.map((author) => author.label),
    contributors: formData.contributors?.map(
      (contributor) => contributor.label,
    ),
    tags: formData.tags.map((tag) => tag.label),
    entrypoint_ids: formData.entrypoint_ids.map((entrypoint) => entrypoint.doi),
    doi,
    owner_identity_id: ownerId,

    publisher: "Gardens-AI",
  };
}
