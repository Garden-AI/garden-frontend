import { useGetUserInfo } from "../api/useGetUserInfo";
import { useGetGardens } from "@/features/gardens/api/useGetGardens";

const UserProfileCard = () => {

  const { data: currUserInfo } = useGetUserInfo();

  const { data: userGardens } = useGetGardens({ owner_uuid: currUserInfo?.identity_id });

  return (
    <div className="flex w-3/12 flex-col justify-between rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md">
      <div className="dark:bg-navy-800 shadow-shadow-500 shadow-3xl rounded-primary relative mx-auto flex h-full w-full max-w-[550px] flex-col items-center bg-white bg-cover bg-clip-border p-4 dark:shadow-none">
        <div className="mt-6 flex flex-col items-center space-y-1">
          <h4 className="text-bluePrimary mb-1 mt-1 text-3xl">{currUserInfo?.name ?? "No Name"}</h4>
          <p className="text-lightSecondary mb-1 font-normal">{currUserInfo?.email}</p>
          <p className="font-style: text-sm italic text-gray-400">
            {currUserInfo?.affiliations?.join(", ")}
          </p>
        </div>
        <div className="mb-4 mt-6 flex flex-col text-gray-600">
          <hr className="h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
          <div className="mb-4 mt-4 flex w-full flex-row items-center justify-center">
            <p className="text-xl font-bold text-sky-500">{userGardens?.length}</p>
            <p className="text-lightSecondary ml-2 text-base font-normal">Gardens Created</p>
          </div>
          <hr className="h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
          <div className="mb-4 mt-4 flex w-full flex-row items-center justify-center">
            <p className="text-xl font-bold text-orange-400">
              {currUserInfo?.saved_garden_dois?.length}
            </p>
            <p className="text-lightSecondary ml-2 text-base font-normal">Gardens Saved</p>
          </div>
          <hr className="h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
