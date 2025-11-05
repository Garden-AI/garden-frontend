import { Garden } from "@/types";

/**
 * Check if a garden matches the function type filter criteria
 */
export const matchesFunctionTypeFilter = (
  garden: Garden,
  functionTypeFilters: string[] | undefined
): boolean => {
  if (!functionTypeFilters || functionTypeFilters.length === 0) {
    return true;
  }

  const hasModal = functionTypeFilters.includes("modal");
  const hasHpc = functionTypeFilters.includes("hpc");

  const hasModalFunctions = garden.modal_function_ids && garden.modal_function_ids.length > 0;
  const hasHpcFunctions = garden.hpc_function_ids && garden.hpc_function_ids.length > 0;

  // If both are selected, show gardens with either type
  if (hasModal && hasHpc) {
    return hasModalFunctions || hasHpcFunctions;
  }

  // If only modal is selected
  if (hasModal) {
    return hasModalFunctions;
  }

  // If only hpc is selected
  if (hasHpc) {
    return hasHpcFunctions;
  }

  return true;
};

/**
 * Check if a garden matches the HPC endpoint filter criteria
 */
export const matchesEndpointFilter = (
  garden: Garden,
  endpointFilters: string[] | undefined
): boolean => {
  if (!endpointFilters || endpointFilters.length === 0) {
    return true;
  }

  if (!garden.hpc_functions) {
    return false;
  }

  // Check if any HPC function has any of the selected endpoints
  return garden.hpc_functions.some((hpcFunc) => {
    if (!hpcFunc.available_endpoints) return false;
    return hpcFunc.available_endpoints.some((endpoint) =>
      endpointFilters.includes(endpoint.name)
    );
  });
};

/**
 * Apply all client-side filters to gardens
 */
export const applyClientSideFilters = (
  gardens: Garden[],
  selectedFilters: Record<string, string[]>
): Garden[] => {
  return gardens.filter((garden) => {
    if (!matchesFunctionTypeFilter(garden, selectedFilters["function_type"])) {
      return false;
    }

    if (!matchesEndpointFilter(garden, selectedFilters["hpc_endpoints"])) {
      return false;
    }

    return true;
  });
};
