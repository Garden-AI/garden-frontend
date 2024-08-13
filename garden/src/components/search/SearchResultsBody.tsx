import { useSearchResults } from "@/hooks/useSearchResults";
import { SearchResultsHeader } from "./SearchResultsHeader";
import { SearchResultsList } from "./SearchResultsList";
import { SearchResultsPagination } from "./Pagination";
import { SearchFilters } from "./Filters";

export const SearchResultsBody = () => {
  const {
    searchResult,
    isFetching,
    isError,
    sortOrder,
    setSortOrder,
    resultsPerPage,
    setResultsPerPage,
    verboseSearchResults,
    setVerboseSearchResults,
  } = useSearchResults();

  return (
    <div className="relative my-8">
      {/* Mobile layout */}
      <div className="flex flex-col gap-8 lg:hidden">
        <SearchFilters />
        <div>
          <SearchResultsHeader
            searchResult={searchResult}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            resultsPerPage={resultsPerPage}
            setResultsPerPage={setResultsPerPage}
            verboseSearchResults={verboseSearchResults}
            setVerboseSearchResults={setVerboseSearchResults}
          />
          <SearchResultsList
            searchResult={searchResult}
            isFetching={isFetching}
            isError={isError}
            verboseSearchResults={verboseSearchResults}
          />
          <SearchResultsPagination
            hasNextPage={searchResult.hasNextPage}
            totalPages={searchResult.totalPages}
          />
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:grid lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2">
          <SearchResultsHeader
            searchResult={searchResult}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            resultsPerPage={resultsPerPage}
            setResultsPerPage={setResultsPerPage}
            verboseSearchResults={verboseSearchResults}
            setVerboseSearchResults={setVerboseSearchResults}
          />
          <SearchResultsList
            searchResult={searchResult}
            isFetching={isFetching}
            isError={isError}
            verboseSearchResults={verboseSearchResults}
          />
          <SearchResultsPagination
            hasNextPage={searchResult.hasNextPage}
            totalPages={searchResult.totalPages}
          />
        </div>
        <div className="lg:col-span-1">
          <SearchFilters />
        </div>
      </div>
    </div>
  );
};
