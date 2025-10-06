import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { HpcFunctionMetadataResponse } from "@/types";

export const useHpcFunctions = () => {
  return useQuery({
    queryKey: ["hpc-functions"],
    queryFn: async () => {
      const response = await axios.get("/hpc/functions");
      return response.data as HpcFunctionMetadataResponse[];
    },
  });
};
