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
        <div className="flex flex-wrap gap-2 text-xs sm:text-base">
          <button
            onClick={() => navigate(`/home`)}
            className="text-gray-500 hover:text-black hover:underline"
          >
            {crumbs.home}
          </button>
          {crumbs.search === "" ? (
            <></>
          ) : (
            <>
              <span className="text-black">/</span>
              <button
                onClick={() => navigate(`/search`)}
                className="text-gray-500 hover:text-black hover:underline"
              >
                {crumbs.search}
              </button>
            </>
          )}
          <span className="text-black">/</span>
          {crumbs.entrypoint.length === 0 ? (
            <button
              onClick={() => navigate(crumbs.garden[1])}
              className="text-black underline"
            >
              {crumbs.garden[0]}
            </button>
          ) : (
            <button
              onClick={() => navigate(crumbs.garden[1])}
              className="text-gray-500 hover:text-black hover:underline"
            >
              {crumbs.garden[0]}
            </button>
          )}
          {crumbs.entrypoint.length === 0 ? (
            <></>
          ) : (
            <span className="text-black">/</span>
          )}
          <button
            onClick={() => navigate(crumbs.entrypoint[1])}
            className="underline"
          >
            {crumbs.entrypoint[0]}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumbs;
