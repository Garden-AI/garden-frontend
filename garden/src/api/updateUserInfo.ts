import { User } from "../types";
import instance from "./axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface userUpdateRequest {
  username?: string;
  name?: string;
  email?: string;
  phone?: string;
  affiliations?: string[];
  skills?: string[];
  domains?: string[];
  pfp_id?: number;
}

const updateUserInfo = async (user: userUpdateRequest): Promise<User> => {
    try {
        // Convert BigInt to string if necessary
        const userToSend = {
            ...user,
            pfp_id: user.pfp_id ? user.pfp_id.toString() : null
        };
        const response = await instance.patch(`/users`, userToSend);
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
            toast.error("Error updating user info: " + error.message);
        },
        onSuccess: (data: User) => {
            console.log("User info updated successfully!", data);
            queryClient.setQueryData(['userInfo'], data);
            queryClient.invalidateQueries(['userInfo']);
            toast.success("User info updated successfully!");
        },
        });
  };
  