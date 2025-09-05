import { useState, useMemo, useEffect } from "react";
import { ModelDeployment } from "../../model-deployments/ModelDeployments";

export interface DeploymentSortOption {
  label: string;
  value: string;
  sortFn: (a: ModelDeployment, b: ModelDeployment) => number;
}

export interface DeploymentFilterConfig {
  label: string;
  key: string;
  defaultChecked: boolean;
  filterFn: (deployment: ModelDeployment) => boolean;
}

export interface UseDeploymentFilteringOptions {
  sortOptions?: DeploymentSortOption[];
  filterConfigs?: DeploymentFilterConfig[];
  searchFields?: Array<keyof ModelDeployment | ((deployment: ModelDeployment) => string)>;
  defaultSort?: string;
}

export const useDeploymentFiltering = (
  deployments: ModelDeployment[],
  options: UseDeploymentFilteringOptions = {}
) => {
  const {
    sortOptions = [],
    filterConfigs = [],
    searchFields = ['name'],
    defaultSort = sortOptions[0]?.value || ''
  } = options;

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState(defaultSort);

  // Initialize filters based on config
  const initialFilters = useMemo(() => {
    const filters: Record<string, boolean> = {};
    filterConfigs.forEach(config => {
      filters[config.key] = config.defaultChecked;
    });
    return filters;
  }, [filterConfigs]);

  const [filters, setFilters] = useState(initialFilters);

  // Sync filters when initial filters change
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // Filter, search, and sort deployments
  const processedDeployments = useMemo(() => {
    let processed = deployments.filter(deployment => {
      // Apply custom filters
      for (const config of filterConfigs) {
        if (!filters[config.key] && config.filterFn(deployment)) {
          return false;
        }
      }

      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matches = searchFields.some(field => {
          if (typeof field === 'function') {
            return field(deployment).toLowerCase().includes(searchLower);
          } else {
            const value = deployment[field];
            if (typeof value === 'string') {
              return value.toLowerCase().includes(searchLower);
            }
            // Special handling for nested function search
            if (field === 'name') {
              const functionMatches = deployment.originalData?.modal_functions?.some((func: any) =>
                func.function_name?.toLowerCase().includes(searchLower) ||
                func.title?.toLowerCase().includes(searchLower) ||
                func.description?.toLowerCase().includes(searchLower)
              );
              return functionMatches;
            }
            return false;
          }
        });
        if (!matches) return false;
      }

      return true;
    });

    // Sort deployments
    const sortOption = sortOptions.find(option => option.value === sortBy);
    if (sortOption) {
      processed.sort(sortOption.sortFn);
    }

    return processed;
  }, [deployments, searchTerm, sortBy, filters, sortOptions, filterConfigs, searchFields]);

  const handleFilterToggle = (key: string) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const hasActiveFilters = useMemo(() => {
    return filterConfigs.some(config => filters[config.key] !== config.defaultChecked);
  }, [filters, filterConfigs]);

  return {
    // State
    searchTerm,
    sortBy,
    filters,

    // Actions
    setSearchTerm,
    setSortBy,
    setFilters,
    handleFilterToggle,

    // Computed
    processedDeployments,
    hasActiveFilters,

    // Config
    sortOptions,
    filterConfigs,
  };
};