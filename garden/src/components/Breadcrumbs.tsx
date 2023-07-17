import React from "react";
import { useNavigate } from "react-router-dom";

const Breadcrumbs = ({ crumbs }: { crumbs: any }) => {
  const navigate = useNavigate();
  if (crumbs.garden.length === 0) {
    return <></>;
  }

  return (
    <div>
      <div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/home`)}
            className="text-gray-500 hover:text-black hover:underline"
          >
            {crumbs.home}
          </button>
          <span className="text-black">/</span>
          <button
            onClick={() => navigate(crumbs.garden[1])}
            className="text-gray-500 hover:text-black hover:underline"
          >
            {crumbs.garden[0]}{" "}
          </button>
          <span className="text-black">/</span>
          <button
            onClick={() => navigate(crumbs.pipeline[1])}
            className="underline"
          >
            {crumbs.pipeline[0]}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumbs;
