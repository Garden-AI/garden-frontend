import { Garden } from "@/api/types";
import axios from "../axios";
import { useMutation } from "@tanstack/react-query";

const saveAndUnsaveGarden = async (variables: any): Promise<Garden> => {
  const { doi } = variables;
  try {
    const response = await axios.put(`/users`, variables);
    return response.data;
  } catch (error) {
    throw new Error("Error saving garden");
  }
};

export const useSaveAndUnsaveGarden = (doi: string) => {
  //need to finish this
  return useMutation<Garden, Error>({
    mutationKey: ["garden", doi],
    onMutate: saveGarden,
    onError: (error, variables, context) => {
      console.log("onError", error, variables, context);
    },
    onSuccess: (data, variables, context) => {
      console.log("onSuccess", data, variables, context);
    },
  });
};
