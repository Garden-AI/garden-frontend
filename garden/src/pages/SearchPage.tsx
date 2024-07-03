import { useState, useEffect, useMemo } from "react";

import { useSearchGardens } from "@/api/search";
import { Garden } from "@/types";

import LoadingSpinner from "@/components/LoadingSpinner";
import GardenBox from "@/components/GardenBox";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

const SearchPage = ({ bread }: { bread: any }) => {
  bread.search = "Search";
  const [query, setQuery] = useState("");
  const [gardens, setGardens] = useState<Garden[]>([]);
  const {
    data: gardenSearchResults,
    isLoading,
    isError,
  } = useSearchGardens("*", "100");

  const filteredGardens = useMemo(
    () => searchGardens(gardenSearchResults || [], query),
    [gardenSearchResults, query],
  );

  useEffect(() => {
    setGardens(prioritizeGardens(filteredGardens));
  }, [filteredGardens]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <h3 className="mt-12 min-h-[400px] text-center text-xl opacity-60">
        Error loading gardens.
      </h3>
    );
  }

  return (
    <div className="min-h-screen px-6 pt-4 font-display md:px-20">
      <h1 className="my-6 text-3xl">Gardens</h1>
      <div className="relative mb-16 h-10 w-full">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 transform">
          <SearchIcon className="h-[18px] w-[18px] text-muted-foreground" />
        </div>
        <Input
          type="text"
          placeholder="Search for a Garden..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={
            "flex h-10 w-full rounded-3xl border px-4 py-2 pl-10 text-sm transition placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black/40 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
          }
        />
      </div>

      {gardens?.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gardens.map((garden: Garden, index: number) => (
            <GardenBox garden={garden} key={index} />
          ))}
        </div>
      ) : (
        <h3 className="mt-12 text-center text-xl opacity-60">
          No results found for "{query}"
        </h3>
      )}
    </div>
  );
};

function prioritizeGardens(gardens: Garden[]) {
  const TEST_GARDEN_REGEX = /test|tutorial|example|dummy|demo|toggle/i;

  const isTestGarden = gardens.map(
    (garden) =>
      RegExp(TEST_GARDEN_REGEX).test(garden.title.toLowerCase()) ||
      garden.entrypoints.some((entrypoint) =>
        entrypoint.tags.includes("tutorial"),
      ),
  );
  const testGardens = gardens.filter((_, index) => isTestGarden[index]);
  const realGardens = gardens.filter((_, index) => !isTestGarden[index]);
  return [...realGardens, ...testGardens];
}

const searchGardens = (gardens: Garden[], searchTerm: string) => {
  return gardens.filter(({ title }) =>
    title.toLowerCase().includes(searchTerm.toLowerCase()),
  );
};

export default SearchPage;
