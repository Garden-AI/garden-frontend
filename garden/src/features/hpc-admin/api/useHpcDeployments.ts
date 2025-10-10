import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { HpcDeploymentResponse } from "@/types";

export const useHpcDeployments = () => {
  return useQuery({
    queryKey: ["hpc-deployments"],
    queryFn: async () => {
      const response = await axios.get("/hpc/deployments");
      return response.data as HpcDeploymentResponse[];
    },
  });
};
