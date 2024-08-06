import { Garden } from "@/api/types";
import instance from "./axios";
import { useQuery } from "@tanstack/react-query";

const getUserGardens = async (): Promise<Garden[]> => {
  try {
    const response = await instance.get(`/gardens`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching user's gardens");
  }
};

export const useGetUserGardens = () => {
  return useQuery<Garden[], Error>({
    queryKey: ["userGardens"],
    queryFn: () => getUserGardens(),
  });
};
