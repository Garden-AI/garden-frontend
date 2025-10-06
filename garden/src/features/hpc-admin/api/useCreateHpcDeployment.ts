import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { HpcDeploymentCreateRequest, HpcDeploymentResponse } from "@/types";

export const useCreateHpcDeployment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: HpcDeploymentCreateRequest) => {
      const response = await axios.post("/hpc/deployments", data);
      return response.data as HpcDeploymentResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hpc-deployments"] });
    },
  });
};
