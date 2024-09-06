import React, { useState, useEffect } from "react";
import UserProfileTabs from "../components/UserProfilePageComponents/UserProfileTabs";
import UserProfileCard from "../components/UserProfilePageComponents/UserProfileCard";
import { useGetUserInfo } from "@/api";
import { icons } from "@/components/UserProfilePageComponents/icons";
import LoadingSpinner from "@/components/LoadingSpinner";
import { LoadingOverlay } from "@/components/LoadingOverlay";

const UserProfilePage = () => {
  const defaultProfileIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100"
      height="100"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-pencil"
    >
      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
      <path d="m15 5 4 4" />
    </svg>
  );

  const [pfp, setPfp] = useState<JSX.Element | null>(defaultProfileIcon);
  const {
    data: currUserInfo,
    isLoading: fetchingUserInfoLoading,
    isError: fetchingUserInfoError,
  } = useGetUserInfo();

  useEffect(() => {
    if (currUserInfo && currUserInfo.profile_pic_id) {
      const selectedIcon = icons.find((icon) => icon.id === currUserInfo.profile_pic_id);
      setPfp(selectedIcon ? selectedIcon.svg : defaultProfileIcon);
    } else {
      setPfp(defaultProfileIcon);
    }
  }, [currUserInfo]);

  if (fetchingUserInfoLoading) {
    return <LoadingOverlay />;
  }

  if (fetchingUserInfoError) {
    return <div>Error loading user information</div>;
  }

  return (
    <div className="flex h-full min-h-[80vh] w-full flex-row justify-center gap-10 p-10 mt-16">
      <UserProfileCard pfp={pfp} setPfp={setPfp} />
      <UserProfileTabs />
    </div>
  );
};

export default UserProfilePage;
