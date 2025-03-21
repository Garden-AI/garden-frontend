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
      // Get all modal functions for the user
      const response = await axios.get(`/modal-functions`, {
        params: { owner_uuid: userUuid }
      });
      
      const allFunctions = response.data || [];
      
      // Filter out excluded function IDs if any
      if (excludeFunctionIds.length > 0) {
        return allFunctions.filter((func: ModalFunction) => 
          !excludeFunctionIds.includes(func.id)
        );
      }
      
      return allFunctions;
    },
    enabled: enabled && !!userUuid,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}; 