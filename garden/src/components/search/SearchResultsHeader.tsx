import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GlobusSearchResult, SortOrder } from "@/hooks/useSearchResults";

export const SearchResultsHeader = ({
  searchResult,
  sortOrder,
  setSortOrder,
  resultsPerPage,
  setResultsPerPage,
  verboseSearchResults,
  setVerboseSearchResults,
}: {
  searchResult: GlobusSearchResult;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  resultsPerPage: string;
  setResultsPerPage: (value: string) => void;
  verboseSearchResults: boolean;
  setVerboseSearchResults: (value: boolean) => void;
}) => {
  return (
    <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div className="text-sm xl:text-base">
        <span>{searchResult?.total}</span> result
        {searchResult?.total !== 1 && "s"} found
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-foreground-primary whitespace-nowrap text-sm">
            Show Entrypoints
          </span>
          <Switch
            checked={verboseSearchResults}
            onCheckedChange={(e) => setVerboseSearchResults(e)}
          />
        </div>

        <Select
          value={sortOrder}
          onValueChange={(value) => {
            setSortOrder(value as SortOrder);
          }}
        >
          <SelectTrigger className="w-full xl:w-48">
            <SelectValue placeholder="Sort by Relevance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Sort by Relevance</SelectItem>
            <SelectItem value="asc">Sort by Title (A-Z)</SelectItem>
            <SelectItem value="desc">Sort by Title (Z-A)</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={resultsPerPage}
          onValueChange={(value) => {
            setResultsPerPage(value);
          }}
        >
          <SelectTrigger className="w-full xl:w-48">
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
  );
};
