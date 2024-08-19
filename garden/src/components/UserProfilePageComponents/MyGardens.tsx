import { Garden, Entrypoint } from "@/api/types";
import GardenBox from "@/components/GardenBox";
import { Link, useNavigate } from "react-router-dom";
import { useGetUserGardens } from "@/api/getUserGardens";
import { useGetUserInfo } from "@/api";
import LoadingSpinner from "@/components/LoadingSpinner";
import NotFoundPage from "@/pages/NotFoundPage";
import { Car, Plus } from "lucide-react";
import { SearchResult } from "../search/SearchResult";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";

const MyGardens = () => {
  const navigate = useNavigate();
  const {
    data: currUserInfo,
    isLoading: getUserInfoLoading,
    isError: getUserInfoError,
  } = useGetUserInfo();
  const {
    data: userGardens,
    isLoading: userGardensLoading,
    isError: userGardensError,
  } = useGetUserGardens(currUserInfo?.identity_id);

  if (getUserInfoLoading || userGardensLoading) {
    return <LoadingSpinner />;
  }
  if (getUserInfoError || userGardensError) {
    return <NotFoundPage />;
  }

  return (
    <div className="">
      <div className="mb-6">
        <div className="flex justify-end">
          <Link
            to="/garden/create"
            className="mb-6 flex flex-row items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm"
          >
            <span className="text-black">Create New Garden</span>
            <Plus />
          </Link>
        </div>
        {userGardens && userGardens.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {userGardens.map((userGarden: Garden, index: number) => (
              <SearchResult verbose={false} garden={userGarden} key={index} />
            ))}

            {/* <Card
              className="h-full min-h-[250px] w-full cursor-pointer border-2 border-primary/40 shadow-md transition hover:border-primary/60 hover:shadow-md"
              onClick={() => navigate("/garden/create")}
            >
              <div className="flex h-full flex-col">
                <CardHeader className="">
                  <CardTitle className="text-ellipsis text-center text-2xl">
                    Create New Garden
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow overflow-hidden">
                  <div className="relative h-[125px] overflow-hidden">
                    <Plus className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 transform text-primary" />
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent"></div>
                  </div>
                </CardContent>
              </div>
            </Card> */}
          </div>
        ) : (
          <h3 className="mt-12 text-center text-xl opacity-80">
            No gardens created yet,{" "}
            <Link
              to="/garden/create"
              className="font-bold text-primary !opacity-100 transition hover:text-primary/50"
            >
              create one here!
            </Link>
          </h3>
        )}
      </div>
    </div>
  );
};

export default MyGardens;
