import React from "react";
import { Garden } from "@/types";
import axios from "@/lib/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MLIPGarden } from "@/features/gardens/hpc-gardens/edith-mlip-garden";

const getGarden = async (doi: string): Promise<Garden> => {
  if (doi === "mlip-garden") {
    return MLIPGarden;
  }
  try {
    const response = await axios.get(`/gardens/${doi}`);
    return response.data;
  } catch {
    throw new Error("Error fetching garden by DOI");
  }
};

export const useGetGarden = (doi: string, options?: { enabled?: boolean }) => {
  const queryClient = useQueryClient();
  const query = useQuery<Garden, Error>({
    queryKey: ["gardens", doi],
    queryFn: () => getGarden(doi),
    enabled: options?.enabled !== false, // Default to true unless explicitly set to false
  });

  // Cache modal functions when garden data is successfully fetched
  React.useEffect(() => {
    if (query.data?.modal_functions) {
      query.data.modal_functions.forEach((fn) => {
        queryClient.setQueryData(["modalFunctions", fn.id], fn);
      });
    }
  }, [query.data, queryClient]);

  return query;
};
