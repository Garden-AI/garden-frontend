import UserProfileTabs from "./UserProfileTabs";
import UserProfileCard from "./UserProfileCard";
import { useGetUserInfo } from "../api/useGetUserInfo";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { useSearchParams } from "react-router-dom";

const UserProfilePage = () => {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") as "profile" | "my-gardens" | "saved-gardens" | "model-deployments" | null;
  
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
      <UserProfileTabs defaultTab="profile" />
    </div>
  );
};

export default UserProfilePage;
