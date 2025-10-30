import axios from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

const deleteHpcFunction = async (id: number) => {
  try {
    const response = await axios.delete(`/hpc/functions/${id}`);
    return response;
  } catch {
    throw new Error("Error deleting HPC function");
  }
};

export const useDeleteHpcFunction = () => {
  return useMutation<AxiosResponse, Error, number, unknown>({
    mutationFn: deleteHpcFunction,
  });
};
