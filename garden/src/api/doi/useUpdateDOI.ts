import axios from "@/api/axios";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { DOIRequest } from "../types";

const updateDOI = async (doi: DOIRequest): Promise<DOIRequest> => {
  try {
    const response = await axios.put<DOIRequest>(`/doi`, doi);
    return response.data;
  } catch (error) {
    throw new Error("Error updating DOI");
  }
};

export const useUpdateDOI = (): UseMutationResult<
  unknown,
  Error,
  DOIRequest,
  unknown
> => {
  return useMutation<unknown, Error, DOIRequest, unknown>({
    mutationFn: (doi: DOIRequest) => updateDOI(doi),
  });
};
