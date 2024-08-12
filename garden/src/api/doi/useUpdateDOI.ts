import axios from "@/api/axios";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { UpdateDOIRequest } from "../types";

const updateDOI = async (doi: UpdateDOIRequest): Promise<UpdateDOIRequest> => {
  try {
    const response = await axios.put<UpdateDOIRequest>(`/doi`, doi);
    console.log(response, doi);
    return response.data;
  } catch (error) {
    throw new Error("Error updating DOI");
  }
};

export const useUpdateDOI = (): UseMutationResult<
  unknown,
  Error,
  UpdateDOIRequest,
  unknown
> => {
  return useMutation<unknown, Error, UpdateDOIRequest, unknown>({
    mutationFn: (doi: UpdateDOIRequest) => updateDOI(doi),
  });
};
