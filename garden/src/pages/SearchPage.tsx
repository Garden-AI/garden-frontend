import { useState, ChangeEvent, useEffect } from "react";
import GardenBox from "../components/GardenBox";
import { useSearchGardens } from "../api/search";
import { Garden } from "../types";
import LoadingSpinner from "../components/LoadingSpinner";

const SearchPage = ({ bread }: { bread: any }) => {
  const [query, setQuery] = useState("");
  const [gardens, setGardens] = useState<Garden[]>([]);
  const {
    data: gardenSearchResults,
    isLoading,
    isError,
  } = useSearchGardens("*", "100");

  bread.search = "Search";

  useEffect(() => {
    setGardens(prioritizeGardens(gardenSearchResults || []));
  }, [gardenSearchResults]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    const filteredResults = gardenSearchResults?.filter((garden: Garden) => {
      return garden.title
        .toLowerCase()
        .includes(event.target.value.toLowerCase());
    });

    setGardens(prioritizeGardens(filteredResults || []));
  };

  if (isLoading) {
    return <LoadingSpinner />;
  } else if (isError) {
    return <p>Error loading gardens</p>;
  }

  return (
    <div className="px-16 pt-24 font-display">
      <p className="-mb-20 -mt-20 text-3xl">Gardens</p>
      <div className="border-gray mt-12 flex items-center justify-between rounded-3xl border px-4 md:mx-12 md:mx-36">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>

        <input
          type="text"
          placeholder="Search for a Garden..."
          className=" mx-2 w-full px-2 py-2 outline-none"
          onInput={handleInputChange}
        />
        {/* <button className="py-2 my-1 bg-green rounded-3xl text-white px-6">Search</button> */}
      </div>
      <div className="grid grid-cols-1 gap-6 py-16 sm:grid-cols-2 md:grid-cols-3">
        {gardens ? (
          gardens.map((garden: Garden, index: number) => (
            <GardenBox garden={garden} key={index} />
          ))
        ) : (
          <p className="text-center text-2xl text-gray-500 sm:col-start-1 sm:col-end-3 md:col-start-2 md:col-end-3">
            No results found for "{query}"
          </p>
        )}
      </div>
    </div>
  );
};

function prioritizeGardens(gardens: Garden[]) {
  const gardenMapping = gardens.map(
    (garden) =>
      RegExp(/test|tutorial|example|dummy|demo|toggle/i).test(garden.title) ||
      garden.entrypoints.some((entrypoint) =>
        entrypoint.tags.includes("tutorial"),
      ),
  );
  const testGardens = gardens.filter((garden, index) => gardenMapping[index]);
  const realGardens = gardens.filter((garden, index) => !gardenMapping[index]);
  return [...realGardens, ...testGardens];
}
export default SearchPage;
