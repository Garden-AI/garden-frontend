import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { Garden, ModalAppMetadataResponse, AsyncModalAppMetadataResponse } from "@/types";

interface UseGardensUsingFunctionsOptions {
  enabled?: boolean;
}

/**
 * Extracts function IDs from a model deployment
 */
const extractFunctionIds = (entity: ModalAppMetadataResponse | AsyncModalAppMetadataResponse): number[] => {
  // Extract IDs from the modal_functions array
  if (entity.modal_functions) {
    return entity.modal_functions.map(func => func.id);
  }
  
  // Otherwise, return an empty array as we don't have the function IDs
  return [];
};

/**
 * Hook to fetch gardens that use functions from a model deployment
 */
export const useGardensUsingFunctions = (
  entity: ModalAppMetadataResponse | AsyncModalAppMetadataResponse | undefined,
  options: UseGardensUsingFunctionsOptions = {}
) => {
  const functionIds = entity ? extractFunctionIds(entity) : [];
  
  return useQuery<Garden[]>({
    queryKey: ["gardensUsingFunctions", functionIds],
    queryFn: async () => {
      if (!functionIds.length) return [];
      
      // Create URLSearchParams with repeated function_ids parameters
      const params = new URLSearchParams();
      functionIds.forEach(id => {
        params.append('function_ids', id.toString());
      });
      
      const response = await axios.get<Garden[]>(`/gardens?${params.toString()}`);
      return response.data;
    },
    enabled: !!entity && functionIds.length > 0 && (options.enabled !== false),
  });
}; 