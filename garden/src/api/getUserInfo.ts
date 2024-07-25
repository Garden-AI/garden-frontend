import { User } from "../types";
import instance from "./axios";
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
    queryKey: ["currUser"],
    queryFn: () => getUserInfo(),
  });
};