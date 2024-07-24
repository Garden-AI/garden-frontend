import { Entrypoint } from "@/api/types";
import axios from "../axios";
import { useMutation } from "@tanstack/react-query";
import { EntrypointCreateRequest } from "@/api/types";

const createEntrypoint = async (entrypoint: EntrypointCreateRequest) => {
  console.log("Attempting to create entrypoint", entrypoint);
  throw new Error("Not implemented");
  return;
  try {
    const response = await axios.post(`/entrypoints`, entrypoint);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching entrypoint by DOI");
  }
};

export const useCreateEntrypoint = () => {
  return useMutation({
    mutationFn: createEntrypoint,
    onError: (error, variables, context) => {
      // console.log("onError", error, variables, context);
    },
    onSuccess: (data, variables, context) => {
      console.log("onSuccess", data, variables, context);
      // The mutation was successful!
      // Use the context to do something with the data
    },
  });
};
