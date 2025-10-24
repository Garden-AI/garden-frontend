import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { HpcFunction } from "@/types";

export const useHpcFunctions = () => {
  return useQuery({
    queryKey: ["hpc-functions"],
    queryFn: async () => {
      const response = await axios.get("/hpc/functions");
      // Add functionType discriminator to all HPC functions
      return response.data.map((fn: any) => ({ ...fn, functionType: 'hpc' as const })) as HpcFunction[];
    },
  });
};
