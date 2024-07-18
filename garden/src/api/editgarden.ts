import { Garden } from "../types";
import axiosInstance from "./axios";
import { AxiosResponse } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useGlobusAuth } from "@/components/globus-auth-context/useGlobusAuth";

const updateGarden = async (
    doi: string,
    garden: Partial<Garden>,
    token: string
): Promise<AxiosResponse<Garden>> => {
    try {
        const url = `${axiosInstance.defaults.baseURL}/gardens/${doi}`;
        console.log(`sending put request to: ${url} with data: `, garden);
        const response = await axiosInstance.put(`/gardens/${doi}`, garden, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response;
    } catch (error) {
        console.error("error details:", error);
        throw new Error("error updating garden :(");
    }
};

export const useUpdateGarden = () => {
    const queryClient = useQueryClient();
    const auth = useGlobusAuth(); // Use the auth hook

    return useMutation({
        mutationFn: async ({ doi, garden }: { doi: string; garden: Partial<Garden> }) => {
            if (!auth.isAuthenticated) {
                throw new Error("user is not authenticated");
            }
            else if (!auth?.authorization?.getGlobusAuthToken){
                throw new Error("unable to get auth token");
            }
            return updateGarden(doi, garden, auth?.authorization?.getGlobusAuthToken());
        },
        onError: (error: any, variables, context) => {
            console.error("error updating garden:", error, variables, context);
            if (error.response && error.response.status === 403) {
                toast.error("you don't have permission to edit this garden!");
            } else if (error.message === "not authenticated or unable to get auth token") {
                toast.error("you must be logged in to edit this garden");
            } else {
                toast.error("error occurred while updating the garden");
            }
        },
        onSuccess: (data, variables, context) => {
            console.log("garden updated successfully!", data, variables, context);
            queryClient.setQueryData(['garden', variables.doi], data.data);
            toast.success("garden updated successfully!");
        },
    });
};