import { Switch } from "@/components/shadcn/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import { GardenSearchResult, SortOrder } from "../hooks/useSearchResults";

export const SearchResultsHeader = ({
  searchResult,
  verboseSearchResults,
  setVerboseSearchResults,
  sortOrder,
  setSortOrder,
  resultsPerPage,
  setResultsPerPage,
}: {
  searchResult: GardenSearchResult;
  verboseSearchResults: boolean;
  setVerboseSearchResults: (value: boolean) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  resultsPerPage: string | null;
  setResultsPerPage: (value: string) => void;
}) => {
  return (
    <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
      <div className="text-sm text-gray-600 mb-3 md:mb-0">
        <span className="font-medium">{searchResult?.total}</span> result
        {searchResult?.total !== 1 && "s"} found
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 mr-1">
          <span className="text-foreground-primary whitespace-nowrap text-xs">
            Show Functions
          </span>
          <Switch
            checked={verboseSearchResults}
            onCheckedChange={(e) => setVerboseSearchResults(e)}
          />
        </div>

        <div className="flex flex-wrap md:flex-nowrap items-center gap-2">
          <Select
            value={sortOrder ? sortOrder : "relevance"}
            onValueChange={(value) => {
              setSortOrder(value as SortOrder);
            }}
          >
            <SelectTrigger className="h-8 text-xs w-[140px]">
              <SelectValue placeholder="Sort Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Sort by Relevance</SelectItem>
              <SelectItem value="asc">Sort by Title (A-Z)</SelectItem>
              <SelectItem value="desc">Sort by Title (Z-A)</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={resultsPerPage ? resultsPerPage : "10"}
            onValueChange={(value) => {
              setResultsPerPage(value);
            }}
          >
            <SelectTrigger className="h-8 text-xs w-[140px]">
              <SelectValue placeholder="Results per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"10"}>10 results per page</SelectItem>
              <SelectItem value="20">20 results per page</SelectItem>
              <SelectItem value="50">50 results per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
