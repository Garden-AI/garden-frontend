import axios from "@/api/axios";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { DOIRequest } from "../types";

interface MintDOIResponse {
  doi: string;
}

const mintDOI = async (): Promise<MintDOIResponse> => {
  try {
    const request: DOIRequest = {
      data: {
        type: "dois",
        attributes: {},
      },
    };
    const response = await axios.post<MintDOIResponse>(`/doi`, request);
    return response.data;
  } catch (error) {
    throw new Error("Error minting DOI");
  }
};

export const useMintDOI = (): UseMutationResult<
  MintDOIResponse,
  Error,
  void,
  unknown
> => {
  return useMutation<MintDOIResponse, Error, void, unknown>({
    mutationFn: mintDOI,
  });
};
