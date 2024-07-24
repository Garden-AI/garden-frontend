import { Entrypoint } from "@/api/types";
import axios from "../axios";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

interface EntrypointParams {
  doi?: string;
  tags?: string;
  authors?: string;
  owner_uuid?: string;
  draft?: string;
  year?: string;
  limit?: number;
}

const getEntrypoint = async (
  params: EntrypointParams,
): Promise<Entrypoint[]> => {
  try {
    const response = await axios.get("/entrypoints", { params });
    return response.data;
  } catch (error) {
    throw new Error("Error fetching entrypoint");
  }
};

export const useGetEntrypoint = (
  params: EntrypointParams,
  options?: UseQueryOptions<Entrypoint[], Error>,
) => {
  return useQuery<Entrypoint[], Error>({
    queryKey: ["entrypoint", params],
    queryFn: () => getEntrypoint(params),
    ...options,
  });
};
