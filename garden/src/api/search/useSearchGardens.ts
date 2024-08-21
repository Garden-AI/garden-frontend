import { search } from "@globus/sdk/cjs";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Garden } from "../types";

const searchGlobus = async (
  searchOptions: Globus.Search.GSearchRequest,
): Promise<Globus.Search.GSearchResult> => {
  try {
    const response = await search.query.post(
      import.meta.env.VITE_GLOBUS_SEARCH_INDEX_UUID,
      {
        payload: searchOptions,
      },
    );
    return await response.json();
  } catch (error) {
    throw new Error("Error fetching gardens by query");
  }
};

export const useSearchGardens = (
  searchOptions: Globus.Search.GSearchRequest,
) => {
  return useQuery<Globus.Search.GSearchResult, Error>({
    queryKey: [
      "search",
      searchOptions.q,
      searchOptions.limit,
      searchOptions.offset,
      searchOptions.filters,
      searchOptions.sort,
      searchOptions.facets,
    ],
    queryFn: async () => searchGlobus(searchOptions),
    placeholderData: keepPreviousData,
  });
};

export const transformSearchResultToGardens = (
  searchResult?: Globus.Search.GSearchResult,
): Garden[] => {
  return (
    searchResult?.gmeta.map((result) => result.entries[0].content as Garden) ||
    []
  );
};

export const transformSearchParamsToGSearchRequest = (
  searchParams: URLSearchParams,
): Globus.Search.GSearchRequest => {
  const filterKeys = ["year", "authors", "tags"];
  const userFilters: Globus.Search.GFilter[] =
    filterKeys
      .filter((key) => searchParams.has(key))
      .map((key) => {
        return {
          field_name: key,
          values: searchParams.get(key)!.split(",").map(decodeURIComponent),
          type: "match_any",
          post_filter: true,
        };
      }) || [];

  const defaultFilters: Globus.Search.GFilter[] = [
    {
      field_name: "doi_is_draft",
      values: ["false"],
      type: "match_all",
    },
    {
      field_name: "is_archived",
      values: ["false"],
      type: "match_all",
    },
  ];

  const filters = [...defaultFilters, ...userFilters];

  const size = Number(searchParams.get("size")) || 10;
  const page = Number(searchParams.get("page")) || 1;
  const sort = searchParams.get("sort");

  const offset = (page - 1) * size;

  const order = sort === "asc" ? "asc" : sort === "desc" ? "desc" : undefined;

  return {
    q: searchParams.get("q") || "*",
    limit: size,
    offset,
    filters,
    facets: filterKeys.flatMap((key: string) => ({
      name: key,
      field_name: key,
      type: "terms",
    })),
    sort: order ? [{ field_name: "title", order }] : undefined,
  };
};
