import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";

export const SearchForm = ({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (query: string | null) => void;
}) => {
  const [queryInputValue, setQueryInputValue] = useState(query || "");

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSearch();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [queryInputValue]);

  const handleSearch = () => {
    setQuery(queryInputValue);
  };

  const handleClear = () => {
    setQuery(null);
    setQueryInputValue("");
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="relative flex w-full">
        <div className="relative flex w-full items-center">
          <Search className="absolute left-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for a garden or function (e.g. Digit Classifier)"
            value={queryInputValue}
            onChange={(e) => setQueryInputValue(e.target.value)}
            className="h-9 w-full rounded-l-full py-1.5 pl-8 pr-10 outline-none transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-0"
          />
          {queryInputValue && (
            <Button
              type="button"
              variant="ghost"
              onClick={handleClear}
              className="absolute right-1 p-1 text-black"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex">
          <Button 
            onClick={handleSearch} 
            className="h-9 rounded-l-none border-l-0 px-3 py-1.5 md:w-24" 
            variant="default"
          >
            <Search className="mr-1.5 h-3.5 w-3.5 md:mr-2" />
            <span>Search</span>
          </Button>
        </div>
      </div>
    </form>
  );
};
