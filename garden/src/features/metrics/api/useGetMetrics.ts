import { useQuery } from "@tanstack/react-query";
import { useGetGardens } from "@/features/gardens/api/useGetGardens";

export interface MetricsData {
  totalGardens: number;
  totalFunctions: number;
  totalInvocations: number;
}

/**
 * Hook to fetch and aggregate platform metrics
 * Only includes published gardens (not draft and not archived) and their associated functions
 */
export const useGetMetrics = () => {
  // Fetch all gardens to filter for published ones
  const { data: allGardens = [], isLoading: isLoadingGardens } = useGetGardens({});

  return useQuery<MetricsData>({
    queryKey: ["metrics", allGardens?.length],
    queryFn: async () => {
      // Filter for published gardens (not draft and not archived)
      const publishedGardens = allGardens.filter(garden => 
        !garden.doi_is_draft && !garden.is_archived
      );

      // Collect all functions from published gardens and deduplicate by function ID
      const functionMap = new Map();
      publishedGardens.forEach(garden => {
        if (garden.modal_functions) {
          garden.modal_functions.forEach(func => {
            functionMap.set(func.id, func);
          });
        }
      });

      const uniqueFunctions = Array.from(functionMap.values());

      // Calculate total invocations by summing up num_invocations from all unique functions
      const totalInvocations = uniqueFunctions.reduce((sum, func) => {
        return sum + (func.num_invocations || 0);
      }, 0);

      return {
        totalGardens: publishedGardens.length,
        totalFunctions: uniqueFunctions.length,
        totalInvocations,
      };
    },
    enabled: !isLoadingGardens,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};