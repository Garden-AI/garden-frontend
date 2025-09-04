import { useState, useMemo, useCallback } from "react";

export type FilterConfig = {
    label: string;
    key: string;
    defaultChecked: boolean;
};

export type FilterState = Record<string, boolean>;

export function useTreeFilter(filterConfigs: FilterConfig[]) {
    // Initialize filter state
    const initialFilterState = useMemo(() => {
        const state: FilterState = {};
        filterConfigs.forEach((config) => {
            state[config.key] = config.defaultChecked;
        });
        return state;
    }, [filterConfigs]);

    const [filterState, setFilterState] = useState<FilterState>(initialFilterState);

    const handleFilterChange = useCallback((filterKey: string) => {
        setFilterState((prev) => ({
            ...prev,
            [filterKey]: !prev[filterKey],
        }));
    }, []);

    const resetFilters = useCallback(() => {
        setFilterState(initialFilterState);
    }, [initialFilterState]);

    // Check if any filters are active (different from default)
    const hasActiveFilters = useMemo(() => {
        return Object.entries(filterState).some(([key, value]) => {
            const config = filterConfigs.find((c) => c.key === key);
            return config && value !== config.defaultChecked;
        });
    }, [filterState, filterConfigs]);

    return {
        filterState,
        handleFilterChange,
        resetFilters,
        hasActiveFilters,
    };
}
