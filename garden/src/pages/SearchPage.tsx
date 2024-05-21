import { useState, useEffect, ChangeEvent } from "react";
import React from "react";
import { searchGardenIndex } from "../globusHelpers";
import GardenBox from "../components/GardenBox";

const SearchPage = ({ bread }: { bread: any }) => {
  const [result, setResult] = useState<any>(undefined);
  const [filteredResult, setFilteredResult] = useState<any>(undefined)
  const [query, setQuery] = useState('')

  bread.search = 'Search'

  useEffect(() => {
    async function Search() {
      try {
        const gmetaArray = await searchGardenIndex({q: "*", limit: "1000"});
        setResult(gmetaArray);
      } catch (error) {
        setResult([]);
      }
    }
    Search();
  }, []);
  if (result === undefined) {
    return (
      <div className="flex items-center justify-center h-[100vh]">
        <svg
          className="w-24 h-24 mr-2 text-gray-200 animate-spin fill-green"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      </div>
    );
  }


  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
    const updatedResults = result.filter((res: any) => {
      return res.entries[0].content.title.toLowerCase().includes(event.target.value.toLowerCase())
    })
    setFilteredResult(updatedResults)
  }
  console.log(result)


  return (
    <>
      <div className="pt-24 px-16 font-display">
        <p className="text-3xl -mt-20 -mb-20">Gardens</p>
        <div className="border border-gray rounded-3xl px-4 mt-12 md:mx-12 md:mx-36 flex justify-between items-center">
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
            className=" w-full mx-2 px-2 outline-none py-2"
            onInput={handleInputChange}
          />
          {/* <button className="py-2 my-1 bg-green rounded-3xl text-white px-6">Search</button> */}
        </div>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-16"
        >
          {filteredResult === undefined ? result.map((res: any) => (
            <GardenBox garden={res} />
          )): filteredResult.map((res: any) => (
            <GardenBox garden={res} />
          ))}
          {filteredResult && filteredResult.length === 0?<p className="text-2xl text-gray-500 text-center sm:col-start-1 sm:col-end-3 md:col-start-2 md:col-end-3">No results found for "{query}"</p>: <></>}
        </div>
      </div>
    </>
  );
};

export default SearchPage;
