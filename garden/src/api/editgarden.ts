import { Garden } from "../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const updateGarden = async (doi: string, garden: Garden): Promise<Garden> => {
    try {
        const response = await fetch(
            `/api/gardens/${encodeURIComponent(doi)}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(garden),
            }
        );

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error("Error updating garden", error);
        throw error;
    }
};

export const useUpdateGarden = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: { doi: string; garden: Garden }) => updateGarden(data.doi, data.garden),
    });
  };