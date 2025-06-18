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
  return useQuery<Garden[], Error>({
    queryKey: ["gardens", params],
    queryFn: () => getGardens(params),
    select: (gardens) => {
      gardens.forEach((garden) => {
        queryClient.setQueryData(["gardens", garden.doi], garden);
      });
      return gardens;
    },
  });
};
