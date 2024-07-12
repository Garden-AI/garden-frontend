import React, { useState, useEffect } from "react";
import { Garden } from "../../types";
import GardenBox from "@/components/GardenBox";
import { useSearchGardens } from "@/api";
import { Link } from "react-router-dom";

const MyGardens = () => {
  // const { doi } = useParams() as { doi: string }; // extract doi from url
  // need to have an array/list of doi's and render the gardens that match those doi's
  const [gardens, setGardens] = useState<Garden[]>([]);
  const [dois, setDois] = useState<string[]>([
    "10.23677/kdv0-sf58",
    "10.23677%2Fsv3j-0q43",
    "10.23677%2F0330-gx38",
    "10.23677%2Faxpa-gc57",
    "10.26311%2Fep98-br79",
    "10.23677%2Fygn0-ry88",
    "10.23677%2Fxcme-kt70",
  ]); // manually added dois for testing
  const { data: allGardens, isLoading, isError } = useSearchGardens("*", "100");

  useEffect(() => {
    if (allGardens) {
      console.log("Fetched gardens:", allGardens);
      console.log("DOIs to match:", dois);

      const decodedDois = dois.map((doi) => decodeURIComponent(doi));
      console.log("Decoded DOIs:", decodedDois);

      // need to filter so that only the gardens created by the current user are displayed; might not filter depending on how the backend tables are structured
      // if there is a separate field in the user table for my gardens that has a list of dois of gardens that the user created, then I can directly access that field
      // and render just those gardens
      const filteredGardens = allGardens.filter((garden: Garden) =>
        decodedDois.includes(garden.doi),
      );
      console.log("Filtered gardens:", filteredGardens);
      setGardens(filteredGardens);
    }
  }, [allGardens, dois]);

  return (
    <div className="">
      <div className="mb-4 flex justify-end">
        <Link
          to="/garden/create"
          className="mb-6 flex flex-row items-center gap-2 rounded-lg border border-gray-200 px-2 py-1 text-sm"
        >
          <span className="text-black">Create New Garden</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="green"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-circle-plus"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12h8" />
            <path d="M12 8v8" />
          </svg>
        </Link>
      </div>
      <div className="mb-6">
        {isLoading ? (
          <h3 className="mt-12 text-center text-xl opacity-60">Loading...</h3>
        ) : isError ? (
          <h3 className="mt-12 text-center text-xl opacity-60">
            Error loading gardens
          </h3>
        ) : gardens.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gardens.map((garden: Garden, index: number) => (
              <GardenBox garden={garden} key={index} />
            ))}
          </div>
        ) : (
          <h3 className="mt-12 text-center text-xl opacity-60">
            No gardens created
          </h3>
        )}
      </div>
    </div>
  );
};

export default MyGardens;
