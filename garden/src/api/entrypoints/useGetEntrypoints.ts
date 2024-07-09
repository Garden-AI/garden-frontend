import { useQuery } from "@tanstack/react-query";
import axios from "../axios";
import { Entrypoint } from "../types";

interface UseGetEntrypointsProps {
  userId?: string;
  gardenId?: string;
}

const getEntrypoints = async ({
  userId,
  gardenId,
}: UseGetEntrypointsProps): Promise<Entrypoint[]> => {
  try {
    const response = await axios.get(
      `/entrypoints?userId=${userId}&gardenId=${gardenId}`,
    );
    return response.data;
  } catch (error) {
    throw new Error("Error fetching entrypoint by DOI");
  }
};

export const useGetEntrypoints = ({
  userId,
  gardenId,
}: UseGetEntrypointsProps) => {
  return useQuery<Entrypoint[], Error>({
    queryKey: ["entrypoints", userId],
    queryFn: () => getEntrypoints({ userId, gardenId }),
  });
};
