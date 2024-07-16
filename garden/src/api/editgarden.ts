import { Garden } from "../types";
import axios from "../axios";
import { AxiosResponse } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const updateGarden = async (
  doi: string,
  garden: Partial<Garden>,
): Promise<AxiosResponse<Garden>> => {
  try {
    const response = await axios.put(`/gardens/${doi}`, garden);
    return response;
  } catch (error) {
    throw new Error("Error updating Garden");
  }
};

export const useUpdateGarden = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ doi, garden }: { doi: string; garden: Partial<Garden> }) => updateGarden(doi, garden),
    onError: (error, variables, context) => {
      console.error("Error updating Garden", error, variables, context);
    },
    onSuccess: (data, variables, context) => {
      console.log("Garden updated successfully", data, variables, context);
      // Update the specific garden query to reflect the updated data
      queryClient.setQueryData(['garden', variables.doi], data.data);
    },
  });
};
