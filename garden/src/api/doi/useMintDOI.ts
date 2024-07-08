import { Entrypoint } from "@/api/types";
import axios from "../axios";
import { useMutation } from "@tanstack/react-query";
import { EntrypointCreateRequest } from "@/api/types";

const mintDOI = async () => {
  try {
    const response = await axios.post(`/doi`, {
      data: { type: "dois", attributes: {} },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error minting DOI");
  }
};

export const useMintDOI = () => {
  return useMutation({
    mutationFn: mintDOI,
    onError: (error, variables, context) => {
      // console.log("onError", error, variables, context);
    },
    onSuccess: (data, variables, context) => {
      // The mutation was successful!
      // Use the context to do something with the data
    },
  });
};
