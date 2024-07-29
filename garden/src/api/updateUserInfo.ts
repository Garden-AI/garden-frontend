import { User } from "../types";
import instance from "./axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface userUpdateRequest {
  username?: string;
  name?: string;
  email?: string;
  phone?: string;
  affiliations?: string[];
  skills?: string[];
  domains?: string[];
  profile_pic_id?: number;
}

const updateUserInfo = async (user: userUpdateRequest): Promise<User> => {
    try {
        const userToSend = {
            ...user,
            profile_pic_id: user.profile_pic_id ? Number(user.profile_pic_id) : undefined,
            phone_number: user.phone || undefined,
        };
        const response = await instance.patch(`/users`, userToSend);
        console.log("response data from server: ", response);
        return response.data;
    } catch (error) {
        console.error("Error updating user info:", error);
        throw error;
    }
};

export const useUpdateUserInfo = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
        mutationFn: updateUserInfo,
        onError: (error: any) => {
            console.error("Error updating user info:", error);
        },
        onSuccess: (data: User) => {
            console.log("User info updated successfully!", data);
            queryClient.setQueryData(['userInfo'], data);
            queryClient.invalidateQueries(['userInfo']);
        },
        });
  };
  