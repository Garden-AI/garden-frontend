import { User } from "@/api/types";
import instance from "@/api/axios";
import { useQuery } from "@tanstack/react-query";

const getUserInfo = async (): Promise<User> => {
  try {
    const response = await instance.get(`/users`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching user info");
  }
};

export const useGetUserInfo = () => {
  return useQuery<User>({
    queryKey: ["user", "me"],
    queryFn: () => getUserInfo(),
  });
};
