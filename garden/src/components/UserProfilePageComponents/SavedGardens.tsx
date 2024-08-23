import { useMemo } from "react";
import { Garden } from "@/api/types";
import GardenBox from "@/components/GardenBox";
import { useGetAllGardens } from "@/api/getAllGardens";
import { useGetUserInfo } from "@/api";
import LoadingSpinner from "@/components/LoadingSpinner";
import NotFoundPage from "@/pages/NotFoundPage";
import { SearchResult } from "../search/SearchResult";

const SavedGardens = () => {
  const {
    data: currUserInfo,
    isLoading: getUserInfoLoading,
    isError: getUserInfoError,
  } = useGetUserInfo();
  const { data: allGardens, isLoading: getAllGardensIsLoading } = useGetAllGardens();

  const filteredSavedGardens = useMemo(() => {
    return (
      allGardens?.filter((garden) => {
        return currUserInfo?.saved_garden_dois?.includes(garden.doi);
      }) ?? []
    );
  }, [allGardens, currUserInfo]);

  if (getUserInfoLoading || getAllGardensIsLoading) {
    return <LoadingSpinner />;
  }
  if (getUserInfoError) {
    return <NotFoundPage />;
  }

  return (
    <div className="">
      <div className="mb-6">
        {filteredSavedGardens && filteredSavedGardens.length > 0 ? (
          <div className="grid grid-cols-1 gap-6  lg:grid-cols-2">
            {filteredSavedGardens.map((individualgarden: Garden, index: number) => (
              <SearchResult verbose={false} garden={individualgarden} key={index} />
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
