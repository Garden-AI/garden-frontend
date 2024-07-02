import { Entrypoint } from "../types";
import axios from "../axios";
import { useQuery } from "@tanstack/react-query";

const getEntrypoint = async (doi: string): Promise<Entrypoint> => {
  try {
    const response = await axios.get(`/garden/${doi}`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching entrypoint by DOI");
  }
};

export const useGetEntrypoint = (doi: string) => {
  return useQuery<Entrypoint, Error>({
    queryKey: ["entrypoint", doi],
    queryFn: () => getEntrypoint(doi),
  });
};
