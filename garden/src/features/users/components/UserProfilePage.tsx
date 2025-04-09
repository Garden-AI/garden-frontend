import UserProfileTabs from "./UserProfileTabs";
import UserProfileCard from "./UserProfileCard";
import { useGetUserInfo } from "../api/useGetUserInfo";
import { LoadingOverlay } from "@/components/LoadingOverlay";

const UserProfilePage = () => {
  const {
    data: currUserInfo,
    isLoading: fetchingUserInfoLoading,
    isError: fetchingUserInfoError,
  } = useGetUserInfo();


  if (fetchingUserInfoLoading) {
    return <LoadingOverlay />;
  }

  if (fetchingUserInfoError) {
    return <div>Error loading user information</div>;
  }

  return (
    <div className="mt-16 flex h-full min-h-[80vh] w-full flex-row justify-center gap-10 p-10">
      <UserProfileCard />
      <UserProfileTabs />
    </div>
  );
};

export default UserProfilePage;
