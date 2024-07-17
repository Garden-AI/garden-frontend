import { Garden } from "../types";
import axios from "../axios";
import { AxiosResponse } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const updateGarden = async (
    doi: string,
    garden: Partial<Garden>,
): Promise<AxiosResponse<Garden>> => {
    try {
        console.log(`Sending PUT request to /gardens/${doi} with data:`, garden);
        const response = await axios.put(`/gardens/${doi}`, garden);
        return response;
    } catch (error) {
        console.error("Error details:", error);
        console.log(error.toJSON());
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
          }
        throw new Error("Error updating Garden");
    }
};

export const useUpdateGarden = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ doi, garden }: { doi: string; garden: Partial<Garden> }) => updateGarden(doi, garden),
        onError: (error, variables, context) => {
            console.error("Error updating Garden", error, variables, context);
        },
        onSuccess: (data, variables, context) => {
            console.log("Garden updated successfully", data, variables, context);
            queryClient.setQueryData(['garden', variables.doi], data.data);
        },
    });
};
