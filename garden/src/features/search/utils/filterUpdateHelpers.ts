/**
 * Update a generic filter by adding or removing a value
 */
export const updateFilterValue = (
  selectedFilters: Record<string, string[]>,
  filterKey: string,
  value: string,
  isChecked: boolean
): Record<string, string[]> => {
  const selected = selectedFilters[filterKey] || [];
  const updated = isChecked
    ? [...selected, value]
    : selected.filter((v) => v !== value);
  return { ...selectedFilters, [filterKey]: updated };
};

/**
 * Update function type filter with special logic to prevent deselecting all
 */
export const updateFunctionTypeFilter = (
  selectedFilters: Record<string, string[]>,
  functionType: string,
  isChecked: boolean
): Record<string, string[]> | null => {
  const selected = selectedFilters["function_type"] || [];

  // Prevent deselecting if it's the only one selected
  if (!isChecked && selected.length === 1 && selected.includes(functionType)) {
    return null; // Signal no update should happen
  }

  const updated = isChecked
    ? [...selected, functionType]
    : selected.filter((type) => type !== functionType);

  return { ...selectedFilters, function_type: updated };
};

/**
 * Get default filter state (used for clearing filters)
 */
export const getDefaultFilterState = (): Record<string, string[]> => {
  return {
    function_type: ["modal", "hpc"],
  };
};

/**
 * Format facet name for display
 */
export const formatFacetName = (name: string): string => {
  // Special case for HPC
  if (name === "hpc_endpoints") return "HPC Endpoints";
  // Default: capitalize and replace underscores with spaces
  return name.split("_").join(" ");
};
