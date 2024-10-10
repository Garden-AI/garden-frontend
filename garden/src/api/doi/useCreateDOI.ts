import axios from "@/api/axios";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { DOIRequest } from "../types";

interface CreateDOIResponse {
  doi: string;
}

const createDOI = async (): Promise<CreateDOIResponse> => {
  try {
    const request: DOIRequest = {
      data: {
        type: "dois",
        attributes: {},
      },
    };
    const response = await axios.post<CreateDOIResponse>(`/doi`, request);
    return response.data;
  } catch (error) {
    throw new Error("Error minting DOI");
  }
};

export const useCreateDOI = (): UseMutationResult<CreateDOIResponse, Error, void, unknown> => {
  return useMutation<CreateDOIResponse, Error, void, unknown>({
    mutationFn: createDOI,
  });
};
