import { User } from "@/types";
import instance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useGlobusAuth } from "@globus/react-auth-context";

const getUserInfo = async (): Promise<User> => {
  try {
    const response = await instance.get(`/users`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching user info");
  }
};

export const useGetUserInfo = () => {
  const auth = useGlobusAuth();
  
  return useQuery<User>({
    queryKey: ["user", "me"],
    queryFn: () => getUserInfo(),
    enabled: auth.isAuthenticated,
  });
};
