import { Garden, Entrypoint } from "@/api/types";
import GardenBox from "@/components/GardenBox";
import { Link } from 'react-router-dom';
import { useGetUserGardens} from "../../api/getUserGardens";
import { useGetUserInfo } from "../../api/getUserInfo";
import LoadingSpinner from "../../components/LoadingSpinner";
import NotFoundPage from "../../pages/NotFoundPage";
import { Plus } from "lucide-react"; 

function isGardenArray(data: Garden[] | undefined): data is Garden[] {
    return Array.isArray(data);
}

const MyGardens = () => {
    const { data: currUserInfo, isLoading: getUserInfoLoading, isError: getUserInfoError } = useGetUserInfo();
    const { data: userGardens, isLoading: userGardensLoading, isError: userGardensError } = useGetUserGardens(currUserInfo?.identity_id);

    if (getUserInfoLoading || userGardensLoading) {
        return <LoadingSpinner />;
    }
    if (getUserInfoError || userGardensError) {
        return <NotFoundPage />;
    }

    return (
        <div className="">
            <div className="flex justify-end mb-4">
            <Link
            to="/garden/create"
            className="flex flex-row items-center gap-2 rounded-lg border border-gray-200 px-2 py-1 text-sm mb-6"
            >
            <span className="text-black">Create New Garden</span>
            <Plus />
            </Link>
            </div>
            <div className="mb-6">
                {userGardens && userGardens.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {userGardens.map((userGarden: Garden, index: number) => (
                        <GardenBox garden={userGarden} key={index} />
                    ))}
                </div>
                ) : (
                    <h3 className="mt-12 text-center text-xl opacity-60">No gardens created</h3>
                )}
            </div>
        </div>
    );
}

export default MyGardens;
