import { LoadingOverlay } from "@/components/LoadingOverlay";
import { SearchFilters } from "@/components/search/Filters";
import { SearchForm } from "@/components/search/Form";
import { SearchResultsPagination } from "@/components/search/Pagination";
import { SearchResultsHeader } from "@/components/search/SearchResultsHeader";
import { SearchResultsList } from "@/components/search/SearchResultsList";
import { useSearchResults } from "@/hooks/useSearchResults";

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
    <div className="mt-16 min-h-screen px-6 font-display md:px-12">
      <h1 className="my-6 text-3xl">Search</h1>
      <SearchForm query={query} setQuery={setQuery} />
      <div className="relative my-8">
        {/* Mobile layout */}
        <div className="flex flex-col gap-8 lg:hidden">
          <SearchFilters
            searchResult={searchResult}
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
          />
          <div>
            <SearchResultsInner />
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-8">
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
