import { Garden } from "../types";
import axiosInstance from "./axios";
import { AxiosResponse } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const updateGarden = async (
    doi: string,
    garden: Partial<Garden>,
): Promise<AxiosResponse<Garden>> => {
    try {
        const url = `${axiosInstance.defaults.baseURL}/gardens/${doi}`;
        console.log(`Sending PUT request to: ${url} with dataL `, garden);
        const response = await axiosInstance.put(`/gardens/${doi}`, garden);
        return response;
    } catch (error) {
        console.error("error details:", error);
        throw new Error("error updating garden :(");
    }
};

export const useUpdateGarden = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ doi, garden }: { doi: string; garden: Partial<Garden> }) => updateGarden(doi, garden),
        onError: (error, variables, context) => {
            console.error("error updating garden :(", error, variables, context);
        },
        onSuccess: (data, variables, context) => {
            console.log("garden updated successfully!", data, variables, context);
            queryClient.setQueryData(['garden', variables.doi], data.data);
        },
    });
};
