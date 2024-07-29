import { Garden } from "../types";
import instance from "./axios";
import { useQuery } from "@tanstack/react-query";

const getAllGardens = async (): Promise<Garden[]> => {
  try {
    const response = await instance.get(`/gardens`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching user's gardens");
  }
};

export const useGetAllGardens = () => {
  return useQuery<Garden[], Error>({
    queryKey: ["userGardens"],
    queryFn: () => getAllGardens(),
  });
};