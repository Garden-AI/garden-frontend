import { LoadingOverlay } from "@/components/LoadingOverlay";
import SearchFilters from "./Filters";
import { SearchForm } from "./Form";
import SearchResultsPagination from "./Pagination";
import { SearchResultsHeader } from "./SearchResultsHeader";
import { SearchResultsList } from "./SearchResultsList";
import { useSearchResults } from "../hooks/useSearchResults";

const SearchPage = () => {
  const {
    query,
    setQuery,
    searchResult,
    isLoading,
    isFetching,
    isError,
    verboseSearchResults,
    setVerboseSearchResults,
    selectedFilters,
    setSelectedFilters,
    resultsPerPage,
    setResultsPerPage,
    sortOrder,
    setSortOrder,
    page,
    setPage,
  } = useSearchResults();

  if (isLoading) {
    return <LoadingOverlay />;
  }

  const SearchResultsInner = () => (
    <>
      <SearchResultsHeader
        searchResult={searchResult}
        resultsPerPage={resultsPerPage}
        setResultsPerPage={setResultsPerPage}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        verboseSearchResults={verboseSearchResults}
        setVerboseSearchResults={setVerboseSearchResults}
      />
      <SearchResultsList
        searchResult={searchResult}
        isFetching={isFetching}
        isError={isError}
        verboseSearchResults={verboseSearchResults}
      />
      <SearchResultsPagination searchResult={searchResult} page={page} setPage={setPage} />
    </>
  );

  return (
    <div className="mt-8 min-h-screen px-4 font-display md:px-8">
      <div className="flex flex-col space-y-3">
        <h1 className="text-2xl font-medium">Search</h1>
        <SearchForm query={query} setQuery={setQuery} />
      </div>
      <div className="relative mt-5 mb-6">
        {/* Mobile layout */}
        <div className="flex flex-col gap-5 lg:hidden">
          <div className="md:hidden">
            <SearchFilters
              searchResult={searchResult}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
            />
          </div>
          <div>
            <SearchResultsInner />
          </div>
        </div>

        {/* Medium layout (md but not lg) */}
        <div className="hidden md:block lg:hidden">
          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-2">
              <SearchResultsInner />
            </div>
            <div className="col-span-1">
              <SearchFilters
                searchResult={searchResult}
                selectedFilters={selectedFilters}
                setSelectedFilters={setSelectedFilters}
              />
            </div>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6">
          <div className="lg:col-span-2">
            <SearchResultsInner />
          </div>
          <div className="lg:col-span-1">
            <SearchFilters
              searchResult={searchResult}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
