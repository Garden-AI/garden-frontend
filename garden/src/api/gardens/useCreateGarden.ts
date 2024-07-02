import { GardenCreateResponse } from "@/api/types";
import axios from "../axios";
import { useMutation } from "@tanstack/react-query";
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
  return useMutation({
    mutationFn: createGarden,
  });
};
