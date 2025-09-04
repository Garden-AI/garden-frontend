import { useState, useCallback } from "react";

export type SortOption<T> = {
    label: string;
    value: string;
    sortFn: (a: T, b: T) => number;
};

export function useTreeSort<T>(sortOptions: SortOption<T>[]) {
    const [sortBy, setSortBy] = useState<string>(sortOptions[0]?.value || "");

    const handleSortChange = useCallback((sortValue: string) => {
        setSortBy(sortValue);
    }, []);

    const getSortFunction = useCallback(() => {
        const currentSortOption = sortOptions.find((option) => option.value === sortBy);
        return currentSortOption?.sortFn;
    }, [sortOptions, sortBy]);

    return {
        sortBy,
        handleSortChange,
        getSortFunction,
    };
}
