import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Garden, GardenSearchFilter, GardenSearchRequest, GardenSearchResponse } from "../types";
import axios from "../axios";

const searchGardens = async (searchOptions: GardenSearchRequest): Promise<GardenSearchResponse> => {
  try {
    const response = await axios.post("/gardens/search", searchOptions);
    return response.data;
  } catch (error) {
    throw new Error("Error searching gardens.");
  }
};

export const useSearchGardens = (searchOptions: GardenSearchRequest) => {
  return useQuery<GardenSearchResponse, Error>({
    queryKey: [
      "search",
      searchOptions.q,
      searchOptions.limit,
      searchOptions.offset,
      searchOptions.filters,
      searchOptions.sort,
    ],
    queryFn: async () => searchGardens(searchOptions),
    placeholderData: keepPreviousData,
  });
};

export const transformSearchResultToGardens = (searchResult?: GardenSearchResponse): Garden[] => {
  return searchResult?.garden_meta || [];
};

export const transformSearchParamsToSearchRequest = (searchParams: URLSearchParams): any => {
  const filterKeys = ["year", "authors", "tags"];
  const userFilters: GardenSearchFilter[] =
    filterKeys
      .filter((key) => searchParams.has(key))
      .map((key) => {
        return {
          field_name: key,
          values: searchParams.get(key)!.split(",").map(decodeURIComponent),
        };
      }) || [];

  const defaultFilters: GardenSearchFilter[] = [
    {
      field_name: "doi_is_draft",
      values: ["false"],
    },
    {
      field_name: "is_archived",
      values: ["false"],
    },
  ];

  const filters = [...defaultFilters, ...userFilters];

  const q = searchParams.get("q") || "";
  const size = Number(searchParams.get("size")) || 10;
  const page = Number(searchParams.get("page")) || 1;
  const sort = searchParams.get("sort");

  const offset = (page - 1) * size;

  const order = sort === "asc" ? "asc" : sort === "desc" ? "desc" : undefined;

  return {
    q,
    limit: size,
    offset,
    filters,
    sort: order ? { field_name: "title", order } : undefined,
  };
};
