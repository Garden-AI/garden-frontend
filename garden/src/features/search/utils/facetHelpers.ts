import { Garden } from "@/types";

export interface FacetValue {
  value: string;
  count: number;
}

export interface Facet {
  name: string;
  values: FacetValue[];
}

/**
 * Comparator for sorting facet values by selection status and count
 */
export const createFacetComparator = (
  selectedFilters: Record<string, string[]>,
  facetName: string
) => {
  return (a: FacetValue, b: FacetValue): number => {
    const filterIsAppliedToA = selectedFilters[facetName]?.includes(a.value);
    const filterIsAppliedToB = selectedFilters[facetName]?.includes(b.value);

    // If the filter is applied to A but not B, A should rank higher, and vice versa
    if (filterIsAppliedToA && !filterIsAppliedToB) {
      return -1;
    }
    if (!filterIsAppliedToA && filterIsAppliedToB) {
      return 1;
    }
    // If the filter is applied to both, the one with the higher count should rank higher
    return b.count - a.count;
  };
};

/**
 * Generate HPC endpoint facet from gardens
 */
export const generateEndpointFacet = (
  gardens: Garden[],
  selectedFilters: Record<string, string[]>
): Facet | null => {
  const endpointCounts: Record<string, number> = {};

  gardens.forEach((garden) => {
    if (garden.hpc_functions) {
      const gardenEndpoints = new Set<string>();
      garden.hpc_functions.forEach((hpcFunc) => {
        if (hpcFunc.available_endpoints) {
          hpcFunc.available_endpoints.forEach((endpoint) => {
            gardenEndpoints.add(endpoint.name);
          });
        }
      });
      // Count each endpoint once per garden
      gardenEndpoints.forEach((endpointName) => {
        endpointCounts[endpointName] = (endpointCounts[endpointName] || 0) + 1;
      });
    }
  });

  // Return null if there are no endpoints
  if (Object.keys(endpointCounts).length === 0) {
    return null;
  }

  const comparator = createFacetComparator(selectedFilters, "hpc_endpoints");

  return {
    name: "hpc_endpoints",
    values: Object.entries(endpointCounts)
      .map(([value, count]) => ({ value, count }))
      .sort(comparator),
  };
};

/**
 * Transform backend facets and add client-side facets
 */
export const processFacets = (
  backendFacets: Record<string, Record<string, number>>,
  gardens: Garden[],
  selectedFilters: Record<string, string[]>
): Facet[] => {
  // Process backend facets
  const processedBackendFacets = Object.entries(backendFacets).map(
    ([name, values]: [string, Record<string, number>]) => {
      const comparator = createFacetComparator(selectedFilters, name);
      return {
        name,
        values: Object.entries(values)
          .map(([value, count]: [string, number]) => ({ value, count }))
          .sort(comparator),
      };
    }
  );

  // Generate endpoint facet
  const endpointFacet = generateEndpointFacet(gardens, selectedFilters);

  // Add endpoint facet if it exists
  return endpointFacet
    ? [...processedBackendFacets, endpointFacet]
    : processedBackendFacets;
};
