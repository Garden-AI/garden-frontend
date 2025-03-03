import { useQuery } from "@tanstack/react-query";

import axios from "@/lib/axios";
import { Entrypoint } from "@/types";

const getEntrypoint = async (doi: string): Promise<Entrypoint> => {
  try {
    const response = await axios.get<Entrypoint>(`/entrypoints/${doi}`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching function");
  }
};

export const useGetEntrypoint = (doi: string) => {
  return useQuery<Entrypoint, Error>({
    queryKey: ["entrypoint", doi] as const,
    queryFn: () => getEntrypoint(doi),
  });
};
