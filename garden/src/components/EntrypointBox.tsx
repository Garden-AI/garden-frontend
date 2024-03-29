import React from "react";
import { useNavigate } from "react-router-dom";

const EntrypointBox = ({ entrypoint }: { entrypoint: any }) => {
  const navigate = useNavigate();
  const text = entrypoint.doi.replace("/", "%2f");

  return (
    <div
      className="border border-gray-200 shadow-sm rounded-lg p-5 flex flex-col justify-between hover:shadow-md hover:cursor-pointer"
      onClick={() => navigate(`/entrypoint/${text}`)}
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-xl">{entrypoint.title}</h2>
        <p className="text-gray-500">
          {entrypoint.steps.length}{" "}
          {entrypoint.steps.length < 2 ? <span>step</span> : <span>steps</span>}
        </p>
        <div className="max-h-[120px] overflow-y-hidden">
          <p className="bg-gradient-to-b from-black to-white bg-clip-text text-transparent h-[160px] overflow-y-hidden">
            {entrypoint.description}
          </p>
        </div>
      </div>
      {entrypoint.tags.length > 0 ? (
        <div className="text-black flex gap-2">
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
              d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 6h.008v.008H6V6z"
            />
          </svg>
          <div>
            {entrypoint.tags
              .map((t: any) => <span key={t}>{t}</span>)
              .reduce((prev: any, curr: any) => [prev, ", ", curr])}
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default EntrypointBox;
