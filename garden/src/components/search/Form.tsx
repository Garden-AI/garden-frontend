import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSearchResults } from "@/hooks/useSearchResults";

export const SearchForm = ({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (query: string) => void;
}) => {
  let [searchParams, setSearchParams] = useSearchParams();
  const [queryValue, setQueryValue] = useState(searchParams.get("q") || "");

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSearch();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [queryValue]);

  const handleSearch = () => {
    setQuery(queryValue);
  };

  const handleClear = () => {
    setQuery("");
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="">
      <div className="relative mb-4 flex w-full">
        <div className="relative flex w-full items-center">
          <Search className="absolute left-3 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for a garden or entrypoint (e.g. Digit Classifier)"
            value={queryValue}
            onChange={(e) => setQueryValue(e.target.value)}
            className="w-full rounded-l-full py-2 pl-10 pr-12 outline-none transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-0"
          />
          {queryValue && (
            <Button
              type="button"
              variant="ghost"
              onClick={handleClear}
              className="absolute right-2 p-1 text-black"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        <div className="flex">
          <Button
            onClick={handleSearch}
            className="rounded-l-none border-l-0 "
            variant="default"
          >
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
      </div>
    </form>
  );
};
