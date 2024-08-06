import { Button } from "../ui/button";
import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchResults } from "@/hooks/useSearchResults";

interface SearchResultsPaginationProps {
  totalPages: number;
  hasNextPage: boolean;
}

export function SearchResultsPagination({
  hasNextPage,
  totalPages,
}: SearchResultsPaginationProps) {
  const { searchResult } = useSearchResults();

  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    setPage(Number(params.get("page") || 1));
  }, [searchParams]);

  if (!searchResult || searchResult.totalPages === 0) return null;

  const goToPage = (pageNumber: number) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("page", String(pageNumber));
      return params.toString();
    });
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
