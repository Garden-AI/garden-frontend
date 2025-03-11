import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { ModalFunction } from "@/types";
import { useGlobusAuth } from "@globus/react-auth-context";

interface UseGetUserModalFunctionsOptions {
  enabled?: boolean;
  excludeFunctionIds?: number[];
}

/**
 * Hook to fetch the current user's modal functions
 * @param options - Query options including whether to enable the query and which function IDs to exclude
 * @returns The user's modal functions and query state
 */
export const useGetUserModalFunctions = (options: UseGetUserModalFunctionsOptions = {}) => {
  const { enabled = true, excludeFunctionIds = [] } = options;
  const auth = useGlobusAuth();
  const userUuid = auth?.authorization?.user?.sub;

  // Fetch the user's modal apps and their functions
  return useQuery<ModalFunction[]>({
    queryKey: ["userModalFunctions", userUuid, excludeFunctionIds],
    queryFn: async () => {
      // First fetch the user's modal apps
      const appsResponse = await axios.get(`/modal-apps`, {
        params: { owner_uuid: userUuid }
      });
      
      const apps = appsResponse.data || [];
      
      // Then fetch the details of each function
      let allFunctions: ModalFunction[] = [];
      
      for (const app of apps) {
        // Skip if the app has no functions
        if (!app.modal_function_ids?.length) continue;
        
        // For each function ID, fetch the function details if not excluded
        for (const functionId of app.modal_function_ids) {
          if (excludeFunctionIds.includes(functionId)) continue;
          
          try {
            const functionResponse = await axios.get(`/modal-functions/${functionId}`);
            allFunctions.push(functionResponse.data);
          } catch (error) {
            console.error(`Failed to fetch modal function ${functionId}:`, error);
          }
        }
      }
      
      return allFunctions;
    },
    enabled: enabled && !!userUuid,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}; 