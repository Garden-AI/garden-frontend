import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
import UserProfileShareModal from "../UserProfileShareModal";
import PfpSelectionModal from "./PfpSelectionModal";
import { useGetUserInfo } from "@/api";
import RenderTags from "../ui/renderTags";
import { useGetUserGardens } from "../../api/getUserGardens";
import { icons, IconType } from "./icons";

type UserProfileCardProps = {
  pfp: JSX.Element | null;
  setPfp: React.Dispatch<React.SetStateAction<JSX.Element | null>>;
};

type PfpSelectionModalProps = {
  setSelectedIcon: (icon: IconType | null) => void;
  closeModal: () => void;
};

const UserProfileCard = ({ pfp, setPfp }: UserProfileCardProps) => {
  const [show, setShow] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  // const [profileIcon, setProfileIcon] = useState<JSX.Element | null>(null);

  const [showIconSelector, setShowIconSelector] = useState(false);
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

  useEffect(() => {
    if (currUserInfo && currUserInfo.profile_pic_id) {
      const selectedIcon = icons.find((icon) => icon.id === currUserInfo.profile_pic_id);
      setPfp(selectedIcon ? selectedIcon.svg : pfp);
    }
  }, [currUserInfo, setPfp, pfp]);

  const copy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    showTooltip();
  };

  const showTooltip = () => {
    if (!tooltipVisible) {
      setTooltipVisible(true);
      setTimeout(() => {
        setTooltipVisible(false);
      }, 3000);
    }
  };

  const showModal = () => {
    setShow(true);
  };

  const closeModal = () => {
    setShow(false);
  };

  const handleIconClick = () => {
    setShowIconSelector(true);
  };

  const closeIconSelector = () => {
    setShowIconSelector(false);
  };

  const defaultProfileIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100"
      height="100"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="lucide lucide-pencil"
    >
      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
      <path d="m15 5 4 4" />
    </svg>
  );

  return (
    <div className="flex w-3/12 flex-col justify-between rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md">
      <div className="dark:bg-navy-800 shadow-shadow-500 shadow-3xl rounded-primary relative mx-auto flex h-full w-full max-w-[550px] flex-col items-center bg-white bg-cover bg-clip-border p-4 dark:shadow-none">
        <div className="mt-8 flex flex-col items-center px-2">
          <div className="relative h-[150px] w-[150px] overflow-hidden">
            <div
              className="relative block flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-primary"
              onClick={handleIconClick}
            >
              {pfp || defaultProfileIcon}
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col items-center space-y-1">
          <h4 className="text-bluePrimary mb-1 mt-1 text-3xl">{currUserInfo?.name ?? "No Name"}</h4>
          <p className="text-lightSecondary mb-1 font-normal">{currUserInfo?.email}</p>
          <p className="font-style: text-sm italic text-gray-400">
            {currUserInfo?.affiliations?.join(", ")}
          </p>
          <p className="font-style: text-sm italic text-gray-400">
            {currUserInfo?.domains?.join(", ")}
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
          <div className="mb-8 flex flex-col items-center gap-2 text-base">
            <p className="text-lightSecondary mt-4 font-normal">Skills</p>
            <RenderTags items={currUserInfo?.skills ?? []} title="" customBgColor="bg-indigo-300" />
          </div>
        </div>
        {/*hide button for now
                <button 
                    onClick={showModal}
                    title="Share" 
                    className="absolute bottom-2 right-2 flex flex-row items-center gap-2 rounded-lg border border-gray-200 px-2 py-1 text-sm"
                >
                    Share Profile
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                    </svg>
                </button>
                */}
        <UserProfileShareModal
          show={show}
          close={closeModal}
          copy={copy}
          showTooltip={showTooltip}
        />
        {showIconSelector && (
          <PfpSelectionModal
            setSelectedIcon={(icon) => {
              if (icon) {
                setPfp(icon.svg);
              } else {
                setPfp(null);
              }
            }}
            closeModal={closeIconSelector}
          />
        )}
      </div>
    </div>
  );
};

export default UserProfileCard;
