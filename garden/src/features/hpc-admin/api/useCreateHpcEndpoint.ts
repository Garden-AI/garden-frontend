import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { HpcEndpointCreateRequest, HpcEndpointResponse } from "@/types";

export const useCreateHpcEndpoint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: HpcEndpointCreateRequest) => {
      const response = await axios.post("/hpc/endpoints", data);
      return response.data as HpcEndpointResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hpc-endpoints"] });
    },
  });
};
