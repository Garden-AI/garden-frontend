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
 * Format facet name for display
 */
export const formatFacetName = (name: string): string => {
  // Special cases
  if (name === "hpc_endpoints") return "HPC Endpoint";
  if (name === "function_type") return "Function Type";
  if (name === "model_authors") return "Model Authors";

  // Default: capitalize and replace underscores with spaces
  return name.split("_").join(" ");
};
