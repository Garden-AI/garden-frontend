import { useQuery } from "@tanstack/react-query";
import { useGetGardens } from "@/features/gardens/api/useGetGardens";

export interface MetricsData {
  allGardens: number;
  publishedGardens: number;
  draftGardens: number;
  archivedGardens: number;
  totalFunctions: number;
  totalInvocations: number;
}

/**
 * Hook to fetch and aggregate platform metrics
 * Includes all garden states and functions from published gardens only
 */
export const useGetMetrics = () => {
  // Fetch all gardens to calculate various metrics
  const { data: allGardens = [], isLoading: isLoadingGardens } = useGetGardens({});

  return useQuery<MetricsData>({
    queryKey: ["metrics", allGardens?.length],
    queryFn: async () => {
      // Filter gardens by state
      const publishedGardens = allGardens.filter(garden => 
        !garden.doi_is_draft && !garden.is_archived
      );
      const draftGardens = allGardens.filter(garden => 
        garden.doi_is_draft && !garden.is_archived
      );
      const archivedGardens = allGardens.filter(garden => 
        garden.is_archived
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
        allGardens: allGardens.length,
        publishedGardens: publishedGardens.length,
        draftGardens: draftGardens.length,
        archivedGardens: archivedGardens.length,
        totalFunctions: uniqueFunctions.length,
        totalInvocations,
      };
    },
    enabled: !isLoadingGardens,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};