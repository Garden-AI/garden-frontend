import { useMemo, useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSearchGardens } from "@/api";
import {
  transformSearchParamsToSearchRequest,
  transformSearchResultToGardens,
} from "@/api/gardens/useSearchGardens";
import { Garden, GardenSearchRequest } from "@/api/types";

type SortOrder = "asc" | "desc" | "relevance" | null;
const filterKeys = ["tags", "authors", "year"];

interface GardenSearchResult {
  total: number;
  hasNextPage: boolean;
  gardens: Garden[];
  totalPages: number;
  facets: Array<{
    name: string;
    values: Array<{
      value: string;
      count: number;
    }>;
  }>;
}

interface SearchResultsState {
  searchResult: GardenSearchResult;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  sortOrder: SortOrder;
  verboseSearchResults: boolean;
  setVerboseSearchResults: (value: boolean) => void;
  setSortOrder: (order: SortOrder) => void;
  resultsPerPage: string;
  setResultsPerPage: (value: string) => void;
  selectedFilters: Record<string, string[]>;
  setSelectedFilters: (filters: Record<string, string[]>) => void;
  query: string;
  setQuery: (query: string) => void;
  page: number;
  setPage: (page: number) => void;
}

export const useSearchResults = (): SearchResultsState => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [verboseSearchResults, setVerboseSearchResults] = useState(false);

  const query = searchParams.get("q") || "";
  const page = Number(searchParams.get("page") || "1");
  const sortOrder = searchParams.get("sort") as SortOrder;
  const resultsPerPage = searchParams.get("size") || "10";

  const selectedFilters = useMemo(() => {
    const filters: Record<string, string[]> = {};
    filterKeys.forEach((key) => {
      const value = searchParams.get(key);
      if (value) {
        filters[key] = value.split(",");
      }
    });
    return filters;
  }, [searchParams]);

  const searchRequest: GardenSearchRequest = useMemo(
    () => transformSearchParamsToSearchRequest(searchParams),
    [searchParams],
  );

  const { data: searchResult, isLoading, isFetching, isError } = useSearchGardens(searchRequest);

  const gardens: Garden[] = useMemo(
    () => transformSearchResultToGardens(searchResult),
    [searchResult],
  );

  const totalPages: number = useMemo(
    () => Math.ceil((searchResult?.total || 0) / Number(resultsPerPage)),
    [searchResult?.total, resultsPerPage],
  );

  const updateSearchParams = useCallback(
    (updates: Partial<Record<string, string | number | null>>) => {
      const newParams = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null) {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams],
  );

  const setQuery = useCallback(
    (newQuery: string) => updateSearchParams({ q: newQuery, page: 1 }),
    [updateSearchParams],
  );

  const setPage = useCallback(
    (newPage: number) => updateSearchParams({ page: newPage }),
    [updateSearchParams],
  );

  const setSortOrder = useCallback(
    (newOrder: SortOrder) => updateSearchParams({ sort: newOrder }),
    [updateSearchParams],
  );

  const setResultsPerPage = useCallback(
    (newSize: string) => updateSearchParams({ size: newSize, page: 1 }),
    [updateSearchParams],
  );

  const setSelectedFilters = useCallback(
    (newFilters: Record<string, string[]>) => {
      const updates: Record<string, string | null> = {};
      filterKeys.forEach((key) => {
        updates[key] = newFilters[key]?.join(",") || null;
      });
      updateSearchParams({ ...updates, page: 1 });
    },
    [updateSearchParams],
  );

  const facets = useMemo(() => {
    if (!searchResult?.facets) return [];
    return Object.entries(searchResult.facets).map(
      ([name, values]: [string, Record<string, number>]) => ({
        name,
        values: Object.entries(values)
          .map(([value, count]: [string, number]) => ({ value, count }))
          .sort((a, b) => {
            return (
              2 * (b.count - a.count) - (Number(selectedFilters[name]?.includes(a.value)) || -1)
            );
          }),
      }),
    );
  }, [searchResult]);

  return {
    searchResult: {
      total: searchResult?.total || 0,
      hasNextPage: page < totalPages,
      gardens,
      totalPages,
      facets,
    },
    isLoading,
    isFetching,
    isError,
    sortOrder,
    setSortOrder,
    resultsPerPage,
    setResultsPerPage,
    selectedFilters,
    setSelectedFilters,
    verboseSearchResults,
    setVerboseSearchResults,
    query,
    setQuery,
    page,
    setPage,
  };
};

export type { GardenSearchResult, SortOrder };
