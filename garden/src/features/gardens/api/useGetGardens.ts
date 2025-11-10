import React from "react";
import { Garden } from "@/types";
import axios from "@/lib/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface GetGardensParams {
  doi?: string;
  draft?: boolean;
  owner_uuid?: string;
  authors?: string;
  contributors?: string;
  tags?: string;
  year?: string;
  limit?: number;
}

const getGardens = async (params: GetGardensParams): Promise<Garden[]> => {
  try {
    const response = await axios.get(`/gardens`, { params });
    return response.data;
  } catch {
    throw new Error("Error fetching gardens");
  }
};

export const useGetGardens = (params: GetGardensParams, options?: { enabled?: boolean }) => {
  const queryClient = useQueryClient();
  const query = useQuery<Garden[], Error>({
    queryKey: ["gardens", params],
    queryFn: () => getGardens(params),
    enabled: options?.enabled !== false, // Default to true unless explicitly set to false
  });

  // Cache gardens when they are successfully fetched
  React.useEffect(() => {
    if (query.data) {
      query.data.forEach((garden) => {
        queryClient.setQueryData(["gardens", garden.doi], garden);
        // NOTE: We do NOT cache modal_functions here because garden search results
        // contain ModalFunctionSearchResult which lacks function_text, file_contents, etc.
        // Components should fetch full metadata via useGetModalFunction when needed.
      });
    }
  }, [query.data, queryClient]);

  return query;
};
