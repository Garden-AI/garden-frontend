import { Garden } from "@/api/types";
import axios from "../axios";
import { useMutation } from "@tanstack/react-query";
import { GardenCreateRequest } from "@/api/types";

const createGarden = async (garden: GardenCreateRequest) => {
  console.log("Attempting to create garden", garden);
  throw new Error("Not implemented");
  return;
  try {
    const response = await axios.post(`/garden`, garden);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching garden by DOI");
  }
};

export const useCreateGarden = () => {
  return useMutation({
    mutationFn: createGarden,
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
