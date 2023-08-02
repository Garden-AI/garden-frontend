import React from "react";
import { useNavigate } from "react-router-dom";
// import RelatedGardenMetrics from "./RelatedGardenMetrics";

const RelatedGardenBox = ({ related }: { related: any }) => {
  const navigate = useNavigate();
  const text = related.entries[0].content.doi.replace("/", "%2f");

  return (
    <div
      className="bg-gray-100 border border-gray-200 shadow-sm rounded-lg flex flex-col justify-center items-center px-5 h-56 min-w-[275px] hover:shadow-md hover:cursor-pointer text-display"
      onClick={() => navigate(`/garden/${text}`)}
    >
      <div className="my-10 whitespace-normal overflow-y-hidden">
        <p className="text-3xl text-center">
          {related.entries[0].content.title}
        </p>
      </div>

      {/* Pins Shares and Runs For Related Garden Box */}
      {/* <RelatedGardenMetrics/> */}
    </div>
  );
};

export default RelatedGardenBox;
