// hooks/useSearchResults.ts
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useSearchGardens } from "@/api";
import {
  transformSearchParamsToGSearchRequest,
  transformSearchResultToGardens,
} from "@/api/search/useSearchGardens";
import { Garden } from "@/api/types";

type SortOrder = "asc" | "desc" | "relevance";

interface GlobusSearchResult {
  total: number;
  hasNextPage: boolean;
  gardens: Garden[];
  totalPages: number;
  facetResults?: Globus.Search.GFacetResult[];
}

interface SearchResultsState {
  searchResult: GlobusSearchResult;
  isLoading: boolean;
  isPending: boolean;
  isFetching: boolean;
  isError: boolean;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  resultsPerPage: string;
  setResultsPerPage: (value: string) => void;
  verboseSearchResults: boolean;
  setVerboseSearchResults: (value: boolean) => void;
}

export const useSearchResults = (): SearchResultsState => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [verboseSearchResults, setVerboseSearchResults] =
    useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    (searchParams.get("sort") as SortOrder) || "relevance",
  );
  const [resultsPerPage, setResultsPerPage] = useState<string>(
    searchParams.get("size") || "10",
  );

  const searchRequest: Globus.Search.GSearchRequest = useMemo(
    () => transformSearchParamsToGSearchRequest(searchParams),
    [searchParams],
  );

  const {
    data: searchResult,
    isPending,
    isLoading,
    isFetching,
    isError,
  } = useSearchGardens(searchRequest);

  const gardens: Garden[] = useMemo(
    () => transformSearchResultToGardens(searchResult),
    [searchResult],
  );

  useEffect(() => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("sort", sortOrder);
      params.set("size", resultsPerPage);
      params.delete("page");
      return params;
    });
  }, [sortOrder, resultsPerPage]);

  const totalPages: number = useMemo(
    () =>
      Math.ceil((searchResult?.total || 0) / (Number(resultsPerPage) || 10)),
    [searchResult?.total, resultsPerPage],
  );

  return {
    searchResult: {
      total: searchResult?.total || 0,
      hasNextPage: searchResult?.has_next_page || false,
      gardens,
      totalPages,
      facetResults: searchResult?.facet_results,
    },
    isLoading,
    isPending,
    isFetching,
    isError,
    sortOrder,
    setSortOrder,
    resultsPerPage,
    setResultsPerPage,
    verboseSearchResults,
    setVerboseSearchResults,
  };
};

export type { GlobusSearchResult, SortOrder };
