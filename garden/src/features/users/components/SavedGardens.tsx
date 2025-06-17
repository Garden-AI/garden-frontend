import React from "react";
import { useMemo } from "react";
import { Garden } from "@/types";
import LoadingSpinner from "@/components/LoadingSpinner";
import NotFoundPage from "@/components/NotFoundPage";
import { SearchResult } from "@/features/search/components/SearchResult";
import { useGetUserInfo } from "../api/useGetUserInfo";
import { useSearchGardens } from "@/features/search/api/useSearchGardens";

const SavedGardens = () => {
  const {
    data: currUserInfo,
    isLoading: getUserInfoLoading,
    isError: getUserInfoError,
  } = useGetUserInfo();

  const searchRequest = useMemo(() => ({
    q: "",
    limit: 100, // Set a reasonable limit for saved gardens
    offset: 0,
    filters: currUserInfo?.saved_garden_dois ? [{
      field_name: "doi",
      values: currUserInfo.saved_garden_dois
    }] : []
  }), [currUserInfo?.saved_garden_dois]);

  const { data: searchResult, isLoading: searchLoading } = useSearchGardens(searchRequest);

  if (getUserInfoLoading || searchLoading) {
    return <LoadingSpinner />;
  }
  if (getUserInfoError) {
    return <NotFoundPage />;
  }

  const savedGardens = searchResult?.garden_meta || [];

  return (
    <div className="">
      <div className="mb-6">
        {savedGardens.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {savedGardens.map((garden: Garden, index: number) => (
              <SearchResult verbose={false} garden={garden} key={index} />
            ))}
          </div>
        ) : (
          <h3 className="mt-12 text-center text-xl opacity-60">No gardens saved</h3>
        )}
      </div>
    </div>
  );
};

export default SavedGardens;
