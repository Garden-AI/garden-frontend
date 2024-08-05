import instance from "../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UserEntrypointUpdateRequest {
    doi: string;
    doi_is_draft: boolean;
    title: string;
    description: string | null;
    year: string;
    func_uuid: string;
    container_uuid: string;
    base_image_uri: string;
    full_image_uri: string;
    notebook_url: string;
    short_name: string;
    function_text: string;
    owner_identity_id: string;
    id: number;
    authors?: string[];
    tags?: string[];
}
  
const updateCurrUserEntrypoint = async (
    entrypointDOI: string, 
    entrypointData: Partial<UserEntrypointUpdateRequest> 
) => {
    try {
        console.log("Payload being sent:", JSON.stringify(entrypointData, null, 2));
        const response = await instance.put(`/entrypoints/${entrypointDOI}`, entrypointData);
        return response.data;
    } catch (error) {
        console.error("Error updating user's entrypoint:", error);
        throw new Error("Error updating user's entrypoint.");
    }
};

export const useUpdateCurrUserEntrypoint = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ entrypointDOI, entrypointData }: { entrypointDOI: string, entrypointData: Partial<UserEntrypointUpdateRequest> }) => 
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