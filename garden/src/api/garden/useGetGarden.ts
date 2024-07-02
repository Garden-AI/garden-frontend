import { Garden } from "../types";
import axios from "../axios";
import { useQuery } from "@tanstack/react-query";

const getGarden = async (doi: string): Promise<Garden> => {
  try {
    const response = await axios.get(`/garden/${doi}`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching garden by DOI");
  }
};

export const useGetGarden = (doi: string) => {
  return useQuery<Garden, Error>({
    queryKey: ["garden", doi],
    queryFn: () => getGarden(doi),
  });
};
