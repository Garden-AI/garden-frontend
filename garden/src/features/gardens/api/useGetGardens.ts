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
  } catch (error) {
    throw new Error("Error fetching garden by DOI");
  }
};

export const useGetGardens = (params: GetGardensParams) => {
  const queryClient = useQueryClient();
  const query = useQuery<Garden[], Error>({
    queryKey: ["gardens", params],
    queryFn: () => getGardens(params),
  });

  // Cache gardens and modal functions when gardens are successfully fetched
  React.useEffect(() => {
    if (query.data) {
      query.data.forEach((garden) => {
        queryClient.setQueryData(["gardens", garden.doi], garden);
        // gardens currently contain their associated function metadata,
        // cache them so we can avoid sending requests for functions
        // we have already seen.
        garden.modal_functions?.forEach((fn) => {
          queryClient.setQueryData(["modalFunctions", fn.id], fn);
        });
      });
    }
  }, [query.data, queryClient]);

  return query;
};
