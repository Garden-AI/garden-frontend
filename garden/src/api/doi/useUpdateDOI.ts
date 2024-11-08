import axios from "@/lib/axios";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { DOIRequest, Entrypoint, Garden, ModalFunction } from "../../types";
import { formDOIRequest } from "@/utils/doi-utils";

interface UpdateDOIRequest {
  resource: Garden | Entrypoint;
  event?: "publish" | "hide" | "register" | null | undefined;
  updateEntrypoints?: boolean;
}

const updateDOI = async ({
  resource,
  event,
  updateEntrypoints,
}: UpdateDOIRequest): Promise<DOIRequest> => {
  const type = (<Garden>resource).entrypoints ? "garden" : "entrypoint";
  let mainRequestBody: DOIRequest = formDOIRequest(resource, event);

  if (type === "garden" && updateEntrypoints) {
    (<Garden>resource).entrypoints?.forEach((entrypoint) => {
      let requestBody = formDOIRequest(entrypoint, event);
      try {
        axios.put(`doi`, requestBody);
      } catch (error) {
        throw new Error("Error updating DOI");
      }
    });
  }

  try {
    const response = await axios.put("doi", mainRequestBody);
    return response.data;
  } catch (error) {
    throw new Error("Error updating DOI");
  }
};

export const useUpdateDOI = (): UseMutationResult<unknown, Error, UpdateDOIRequest, unknown> => {
  return useMutation<unknown, Error, UpdateDOIRequest, unknown>({
    mutationFn: ({ resource, event, updateEntrypoints }: UpdateDOIRequest) =>
      updateDOI({ resource, event, updateEntrypoints }),
  });
};
