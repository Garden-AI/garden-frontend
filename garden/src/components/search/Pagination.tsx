import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GardenSearchResult } from "@/hooks/useSearchResults";

export function SearchResultsPagination({
  searchResult,
  page,
  setPage,
}: {
  searchResult: GardenSearchResult;
  page: number;
  setPage: (page: number) => void;
}) {
  const totalPages = searchResult?.totalPages;
  const hasNextPage = searchResult?.hasNextPage;

  if (!searchResult || searchResult.totalPages === 0) return null;

  const goToPage = (pageNumber: number) => {
    setPage(pageNumber);
  };

  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex-1 text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(page - 1)}
          disabled={page === 1}
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(page + 1)}
          disabled={!hasNextPage}
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
