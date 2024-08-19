import { Entrypoint } from "@/api/types";
import axios from "../axios";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

const getEntrypoint = async (doi: string): Promise<Entrypoint> => {
  try {
    const response = await axios.get(`/entrypoints/${doi}`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching entrypoint");
  }
};

export const useGetEntrypoint = (doi: string) => {
  return useQuery<Entrypoint, Error>({
    queryKey: ["entrypoint", doi],
    queryFn: () => getEntrypoint(doi),
  });
};
