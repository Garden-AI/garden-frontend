import { UpdateUserSchema } from "@/api/types";
import instance from "./axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const updateUserInfo = async (user: UpdateUserSchema): Promise<UpdateUserSchema> => {
    try {
        const userToSend = {
            ...user,
            profile_pic_id: user.profile_pic_id ? Number(user.profile_pic_id) : undefined,
            phone_number: user.phone_number || undefined,
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
        onSuccess: (data: UpdateUserSchema) => {
            console.log("User info updated successfully!", data);
            queryClient.setQueryData(['userInfo'], data);
            queryClient.invalidateQueries({ queryKey: ['userInfo'] });
        },
        });
  };
  