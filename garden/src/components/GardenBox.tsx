import React from "react";
import { useNavigate } from "react-router-dom";

const GardenBox = ({ garden }: { garden: any }) => {
  const navigate = useNavigate();
  const text = garden.entries[0].content.doi.replace("/", "%2f");

  return (
    <div
      className="text-display flex min-w-[50%] flex-col justify-between rounded-lg border border-gray-200 p-5 shadow-sm hover:cursor-pointer hover:shadow-md"
      onClick={() => navigate(`/garden/${text}`)}
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-l font-semibold">
          {garden.entries[0].content.title}
        </h2>
        <div className="max-h-[120px] overflow-y-hidden">
          <p className="h-[160px] overflow-y-hidden bg-gradient-to-b from-black bg-clip-text text-transparent">
            {garden.entries[0].content.description}
          </p>
        </div>
      </div>
      {garden.entries[0].content.tags.length > 0 ? (
        <div className="flex gap-4 text-sm text-gray-500">
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
              d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 6h.008v.008H6V6z"
            />
          </svg>
          <div>
            {garden.entries[0].content.tags
              .map((t: any) => <span>{t}</span>)
              .reduce((prev: any, curr: any) => [prev, ", ", curr])}
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default GardenBox;
