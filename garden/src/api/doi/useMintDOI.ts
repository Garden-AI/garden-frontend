import axios from "@/api/axios";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

interface MintDOIResponse {
  doi: string;
}
interface MintDOIRequest {
  data: {
    type: string;
    attributes: {};
  };
}

const mintDOI = async (): Promise<MintDOIResponse> => {
  try {
    const request: MintDOIRequest = {
      data: { type: "dois", attributes: {} },
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
