import { Garden } from "@/types";
import axios from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GardenCreateRequest } from "@/types";
import { AxiosError } from "axios";
import { ApiError } from "../utils/garden.utils";

const createGarden = async (garden: GardenCreateRequest): Promise<Garden> => {
  try {
    const response = await axios.post(`/gardens`, garden);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw ApiError.fromAxiosError(error);
    }
    throw error;
  }
};

export const useCreateGarden = () => {
  const queryClient = useQueryClient();
  return useMutation<Garden, ApiError, GardenCreateRequest>({
    mutationFn: createGarden,
    onSuccess: (garden) => {
      queryClient.setQueryData(["gardens", garden.doi], garden);
      queryClient.invalidateQueries({ queryKey: ["gardens"] });
    },
  });
};
