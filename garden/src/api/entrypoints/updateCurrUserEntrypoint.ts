import instance from "../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { EntrypointCreateRequest } from "@/api/types";
  
const updateCurrUserEntrypoint = async (
    entrypointDOI: string, 
    entrypointData: Partial<EntrypointCreateRequest> 
) => {
    try {
        console.log("Payload being sent:", JSON.stringify(entrypointData, null, 2));
        const response = await instance.patch(`/entrypoints/${entrypointDOI}`, entrypointData, {
            headers: {
                'Accept': 'application/json',
            },
        });
        return response;
    } catch (error) {
        console.error("Error updating user's entrypoint:", error);
        throw new Error("Error updating user's entrypoint.");
    }
};


export const useUpdateCurrUserEntrypoint = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ entrypointDOI, entrypointData }: { entrypointDOI: string, entrypointData: Partial<EntrypointCreateRequest> }) => 
            updateCurrUserEntrypoint(entrypointDOI, entrypointData),
        
        onError: (error) => {
            console.error("Error updating entrypoint:", error);
            toast.error("Failed to update the entrypoint.");
        },
        
        onSuccess: (data, variables, context) => {
            console.log("Entrypoint updated successfully!", data, variables, context);
            queryClient.setQueryData(['entrypoint', variables.entrypointDOI], data);
            toast.success("Entrypoint updated successfully!");
        },
    });
};