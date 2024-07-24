import { GardenCreateResponse } from "@/api/types";
import axios from "../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GardenCreateRequest } from "@/api/types";
import { AxiosResponse } from "axios";

const createGarden = async (
  garden: GardenCreateRequest,
): Promise<AxiosResponse<GardenCreateResponse, any>> => {
  try {
    const response = await axios.post(`/gardens`, garden);
    return response;
  } catch (error) {
    throw new Error("Error creating Garden");
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
