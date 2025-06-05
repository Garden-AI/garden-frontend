import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { ModalFunction } from "@/types";

/**
 * Hook to fetch all modal functions across the platform
 * Used for metrics and administrative purposes
 */
export const useGetAllModalFunctions = () => {
  return useQuery<ModalFunction[]>({
    queryKey: ["allModalFunctions"],
    queryFn: async () => {
      // Get all modal functions without owner filter
      const response = await axios.get(`/modal-functions`);
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};