import { GlobusSearchResult, useSearchResults } from "@/hooks/useSearchResults";
import NotFoundPage from "@/pages/NotFoundPage";
import LoadingSpinner from "../LoadingSpinner";
import { SearchResult } from "./SearchResult";
import { cn } from "@/lib/utils";

export const SearchResultsList = ({
  searchResult,
  isFetching,
  isError,
  verboseSearchResults,
}: {
  searchResult: GlobusSearchResult;
  isFetching: boolean;
  isError: boolean;
  verboseSearchResults: boolean;
}) => {
  const gardens = searchResult.gardens;

  if (isError) return <NotFoundPage />;

  if (searchResult.total === 0 && !isFetching)
    return (
      <div className="flex h-96 items-center justify-center">
        No results found
      </div>
    );

  return (
    <div
      className={cn(
        "relative grid grid-cols-1",
        verboseSearchResults ? "space-y-4" : "gap-4 lg:grid-cols-2",
      )}
    >
      {isFetching && (
        <div className="fixed bottom-0 left-0 right-0 top-0  h-full">
          <div className="flex h-screen items-center justify-center ">
            <LoadingSpinner />
          </div>
        </div>
      )}
      {gardens.map((garden: any, index: number) => (
        <SearchResult
          key={index}
          garden={garden}
          verbose={verboseSearchResults}
        />
      ))}
    </div>
  );
};
