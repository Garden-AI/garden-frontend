import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { HpcFunctionCreateRequest, HpcFunctionMetadataResponse } from "@/types";

export const useCreateHpcFunction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: HpcFunctionCreateRequest) => {
      const response = await axios.post("/hpc/functions", data);
      return response.data as HpcFunctionMetadataResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hpc-functions"] });
    },
  });
};
