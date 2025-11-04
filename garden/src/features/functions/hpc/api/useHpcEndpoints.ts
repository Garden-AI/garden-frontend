import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { HpcEndpointResponse } from "@/types";

export const useHpcEndpoints = () => {
  return useQuery({
    queryKey: ["hpc-endpoints"],
    queryFn: async () => {
      const response = await axios.get("/hpc/endpoints");
      return response.data as HpcEndpointResponse[];
    },
  });
};
