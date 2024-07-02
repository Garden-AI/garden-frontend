import axios from "../axios";
import { useQuery } from "@tanstack/react-query";

const getGreet = async () => {
  try {
    const response = await axios.get(`/greet`);
    return response.data;
  } catch (error) {
    throw new Error("Error greeting user");
  }
};

export const useGreetings = () => {
  return useQuery({
    queryKey: ["greet"],
    queryFn: () => getGreet(),
  });
};
