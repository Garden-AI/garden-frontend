import { Garden } from "@/api/types";
import instance from "./axios";
import { useQuery } from "@tanstack/react-query";

const getUserGardens = async (owner_uuid: string): Promise<Garden[]> => {
  try {
    const response = await instance.get(`/gardens`, {
      params: { owner_uuid } 
    });
    return response.data;
  } catch (error) {
    throw new Error("Error fetching user's gardens");
  }
};

export const useGetUserGardens = (owner_uuid: string | undefined) => {
  return useQuery<Garden[], Error>({
    queryKey: ["userGardens", owner_uuid],
    queryFn: () => getUserGardens(owner_uuid!),
    enabled: !!owner_uuid, 
  });
};