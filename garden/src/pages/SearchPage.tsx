import { useState, useEffect } from "react";
import React from "react";
import GardenBox from "../components/GardenBox";
import { SEARCH_SCOPE, GARDEN_INDEX_URL } from "../constants";
import { fetchWithScope } from "../globusHelpers";

const SearchPage = () => {
  const [result, setResult] = useState<Array<any>>([]);

  useEffect(() => {
    async function Search() {
      try {
        const response = await fetchWithScope(
          SEARCH_SCOPE,
          GARDEN_INDEX_URL + "/search?q=2023"
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const content = await response.json();
        setResult(content.gmeta);
      } catch (error) {
        setResult([]);
      }
    }
    Search();
  }, []);
  return (
    <>
      <div className="pt-24 px-16 font-display">
        <p className="text-3xl">Gardens</p>
        <div className="border border-gray rounded-3xl px-4 mt-12 mx-36 flex justify-between items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
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
            className=" w-full mx-2 px-2 outline-none"
          />
          <button className="py-2 my-1 bg-green rounded-3xl text-white px-6">Search</button>
        </div>
        <div
          className="grid gird-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-16"
        >
          {result.map((res) => (
            <GardenBox garden={res} />
          ))}
        </div>
      </div>
    </>
  );
};

export default SearchPage;
