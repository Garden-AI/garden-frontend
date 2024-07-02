import { Garden } from "@/types";
import axios from "../axios";
import { useMutation } from "@tanstack/react-query";

const updateGarden = async (variables: any): Promise<Garden> => {
  const { doi } = variables;
  try {
    const response = await axios.put(`/garden/${doi}`, variables);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching garden by DOI");
  }
};

export const useUpdateGarden = (doi: string) => {
  return useMutation<Garden, Error>({
    mutationKey: ["garden", doi],
    onMutate: updateGarden,
    onError: (error, variables, context) => {
      console.log("onError", error, variables, context);
      // An error happened!
      // Use the context to roll back the mutation
    },
    onSuccess: (data, variables, context) => {
      console.log("onSuccess", data, variables, context);
      // The mutation was successful!
      // Use the context to do something with the data
    },
  });
};
