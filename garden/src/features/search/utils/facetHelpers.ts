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
 * Transform backend facets into the format expected by the UI
 */
export const processFacets = (
  backendFacets: Record<string, Record<string, number>>,
  selectedFilters: Record<string, string[]>
): Facet[] => {
  return Object.entries(backendFacets).map(
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
};
