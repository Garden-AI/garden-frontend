import { Garden } from "@/api/types";
import instance from "./axios";
import { AxiosResponse } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const updateGarden = async (
    doi: string,
    garden: Partial<Garden>,
): Promise<AxiosResponse<Garden>> => {
    try {
        const url = `${instance.defaults.baseURL}/gardens/${doi}`;
        const updatedGarden = {
            ...garden,
            is_archived: false, 
        };
        console.log(`sending put request to: ${url} with data: `, updatedGarden);
        const response = await instance.put(`/gardens/${doi}`, updatedGarden,);
        return response;
    } catch (error) {
        console.error("error details:", error);
        throw new Error("error updating garden :(");
    }
};

export const useUpdateGarden = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ doi, garden }: { doi: string; garden: Partial<Garden>; }) => 
            updateGarden(doi, garden),
        onError: (error: any) => {
            console.error("Error updating garden:", error);
            if (error.response?.status === 401) {
                toast.error("Authentication failed, please log in again.");
            } else if (error.response?.status === 403) {
                toast.error("You don't have permission to edit this garden!");
            } else {
                toast.error("an error occurred while updating the garden");
            }
        },
        onSuccess: (data, variables, context) => {
            console.log("garden updated successfully!", data, variables, context);
            queryClient.setQueryData(['garden', variables.doi], data.data);
            toast.success("garden updated successfully!");
        },
    });
};