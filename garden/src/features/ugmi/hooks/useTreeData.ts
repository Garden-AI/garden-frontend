import { useMemo } from "react";
import { useTreeFilter, FilterConfig, FilterState } from "./useTreeFilter";
import { useTreeSearch } from "./useTreeSearch";
import { useTreeSort, SortOption } from "./useTreeSort";
import { useTreeExpansion } from "./useTreeExpansion";

export type TreeNode<TParent = unknown, TChild = unknown> = {
    parent: TParent;
    children: TChild[];
};

export type SearchFunction<TParent, TChild> = (
    node: TreeNode<TParent, TChild>,
    searchTerm: string,
) => boolean;

export type FilterFunction<TParent, TChild> = (
    node: TreeNode<TParent, TChild>,
    filterState: FilterState,
) => boolean;

export type UseTreeDataProps<TParent, TChild> = {
    data: TreeNode<TParent, TChild>[];
    sortOptions: SortOption<TParent>[];
    filterConfigs: FilterConfig[];
    searchFunction: SearchFunction<TParent, TChild>;
    filterFunction: FilterFunction<TParent, TChild>;
};

export function useTreeData<TParent, TChild>({
    data,
    sortOptions,
    filterConfigs,
    searchFunction,
    filterFunction,
}: UseTreeDataProps<TParent, TChild>) {

    const search = useTreeSearch();
    const filter = useTreeFilter(filterConfigs);
    const sort = useTreeSort(sortOptions);
    const expansion = useTreeExpansion();

    // Filter, search, and sort nodes
    const processedData = useMemo(() => {
        let filtered = data.filter((node) => {
            // Apply filters
            if (!filterFunction(node, filter.filterState)) return false;

            // Apply search
            if (search.searchTerm.trim() && !searchFunction(node, search.searchTerm)) return false;

            return true;
        });

        // Apply sorting
        const sortFn = sort.getSortFunction();
        if (sortFn) {
            filtered = [...filtered].sort((a, b) => sortFn(a.parent, b.parent));
        }

        return filtered;
    }, [data, filter.filterState, search.searchTerm, sort, filterFunction, searchFunction]);

    const hasData = data.length > 0;
    const hasResults = processedData.length > 0;

    return {
        // Processed data
        processedData,
        hasData,
        hasResults,

        // Sub-hooks
        search,
        filter,
        sort,
        expansion,
    };
}
