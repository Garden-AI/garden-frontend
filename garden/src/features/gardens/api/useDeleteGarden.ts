import { GardenCreateResponse } from "@/types";
import axios from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

const deleteGarden = async (doi: string) => {
  try {
    const response = await axios.delete(`/gardens/${doi}`);
    return response;
  } catch (error) {
    throw new Error("Error deleting Garden");
  }
};

export const useDeleteGarden = () => {
  return useMutation<AxiosResponse<GardenCreateResponse, any>, Error, string, unknown>({
    mutationFn: deleteGarden,
  });
};
