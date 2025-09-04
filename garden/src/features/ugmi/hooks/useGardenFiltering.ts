import { useState, useMemo } from "react";
import { Garden } from "@/types";

export interface GardenSortOption {
  label: string;
  value: string;
  sortFn: (a: Garden, b: Garden) => number;
}

export interface GardenFilterConfig {
  label: string;
  key: string;
  defaultChecked: boolean;
  filterFn: (garden: Garden) => boolean;
}

export interface UseGardenFilteringOptions {
  sortOptions?: GardenSortOption[];
  filterConfigs?: GardenFilterConfig[];
  searchFields?: Array<keyof Garden | ((garden: Garden) => string)>;
  defaultSort?: string;
}

export const useGardenFiltering = (
  gardens: Garden[],
  options: UseGardenFilteringOptions = {}
) => {
  const {
    sortOptions = [],
    filterConfigs = [],
    searchFields = ['title', 'description'],
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

  // Filter, search, and sort gardens
  const processedGardens = useMemo(() => {
    let processed = gardens.filter(garden => {
      // Apply custom filters
      for (const config of filterConfigs) {
        if (!filters[config.key] && config.filterFn(garden)) {
          return false;
        }
      }
      
      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matches = searchFields.some(field => {
          if (typeof field === 'function') {
            return field(garden).toLowerCase().includes(searchLower);
          } else {
            const value = garden[field];
            return typeof value === 'string' && value.toLowerCase().includes(searchLower);
          }
        });
        if (!matches) return false;
      }
      
      return true;
    });

    // Sort gardens
    const sortOption = sortOptions.find(option => option.value === sortBy);
    if (sortOption) {
      processed.sort(sortOption.sortFn);
    }

    return processed;
  }, [gardens, searchTerm, sortBy, filters, sortOptions, filterConfigs, searchFields]);

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
    processedGardens,
    hasActiveFilters,
    
    // Config
    sortOptions,
    filterConfigs,
  };
};