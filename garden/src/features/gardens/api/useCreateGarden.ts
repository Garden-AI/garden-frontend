import { GardenCreateResponse } from "@/types";
import axios from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GardenCreateRequest } from "@/types";
import { AxiosError, AxiosResponse } from "axios";
import { ApiError } from "../utils/garden.utils";

const createGarden = async (
  garden: GardenCreateRequest,
): Promise<AxiosResponse<GardenCreateResponse, any>> => {
  try {
    const response = await axios.post(`/gardens`, garden);
    return response;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
     throw ApiError.fromAxiosError(error);
    }
    throw error;
  }
};

export const useCreateGarden = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createGarden,
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData(["garden", data.data.doi], data.data);
    },
  });
};
