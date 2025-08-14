import { useQuery } from "@tanstack/react-query";
import { GardenSearchResponse } from "@/types";
import axios from "@/lib/axios";

export const useSavedGardens = (savedGardenDois: string[]) => {
  return useQuery<GardenSearchResponse>({
    queryKey: ["savedGardens", savedGardenDois.sort().join(',')],
    queryFn: async () => {
      if (savedGardenDois.length === 0) {
        return { garden_meta: [] };
      }
      
      const searchRequest = {
        q: "",
        limit: 100,
        offset: 0,
        filters: [{
          field_name: "doi",
          values: savedGardenDois,
          operation: "OR" as const,
        }]
      };
      
      const response = await axios.post("/gardens/search", searchRequest);
      return response.data;
    },
    enabled: true, // Always enabled, but returns empty if no DOIs
  });
};