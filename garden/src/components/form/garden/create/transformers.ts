import { GardenCreateRequest } from "@/api/types";
import { GardenCreateFormData } from "./schemas";

export function transformFormToRequest(
  formData: GardenCreateFormData,
  doi: string,
  ownerId: string,
): GardenCreateRequest {
  return {
    ...formData,
    owner_identity_id: ownerId,
    doi,
    publisher: "Gardens-AI",
    is_archived: false,
  };
}
