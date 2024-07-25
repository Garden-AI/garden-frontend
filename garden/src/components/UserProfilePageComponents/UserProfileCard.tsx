import React, { useState } from 'react';
import UserProfileShareModal from '../UserProfileShareModal';
import PfpSelectionModal from './PfpSelectionModal';
import { useGetUserInfo } from "../../api/getUserInfo";
import RenderTags from "../ui/renderTags";

const UserProfileCard = () => {
    const [show, setShow] = useState(false);
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [profileIcon, setProfileIcon] = useState(null);
    const [showIconSelector, setShowIconSelector] = useState(false);
    const { data: currUserInfo, isLoading: getUserInfoLoading, isError:getUserInfoError } = useGetUserInfo();

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
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
    );

    return (
        <div className='flex flex-col justify-between rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md w-4/12'>
            <div className="dark:bg-navy-800 shadow-shadow-500 shadow-3xl rounded-primary relative mx-auto flex h-full w-full max-w-[550px] flex-col items-center bg-white bg-cover bg-clip-border p-4 dark:shadow-none">
                <div className="mt-8 flex flex-col items-center px-2">
                    <div className="relative h-[150px] w-[150px] overflow-hidden">
                        <div
                            className="cursor-pointer block relative h-full w-full flex items-center justify-center bg-green rounded-full"
                            onClick={handleIconClick}
                        >
                            {profileIcon || defaultProfileIcon}
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex flex-col items-center space-y-1">
                    <h4 className="text-bluePrimary text-3xl mb-1 mt-1">{currUserInfo?.name ?? 'No Name'}</h4>
                    <p className="text-lightSecondary font-normal mb-1">{currUserInfo?.email}</p>
                    <p className="text-gray-400 text-sm font-style: italic">{currUserInfo?.affiliations?.join(", ")}</p>
                    <p className="text-gray-400 text-sm font-style: italic">{currUserInfo?.domains?.join(", ")}</p>
                </div>
                <div className="mt-6 mb-4 flex flex-col text-gray-600">
                    <hr className="h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
                    <div className="flex flex-row items-center justify-center w-full mt-4 mb-4">
                        <p className="text-sky-500 text-xl font-bold">9</p>
                        <p className="text-lightSecondary text-base font-normal ml-2">Gardens Created</p>
                    </div>
                    <hr className="h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
                    <div className="flex flex-row items-center justify-center w-full mt-4 mb-4">
                        <p className="text-orange text-xl font-bold">13</p>
                        <p className="text-lightSecondary text-base font-normal ml-2">Gardens Saved</p>
                    </div>
                    <hr className="h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
                    <div className="flex flex-col items-center gap-2 text-base mb-8">
                        <p className="text-lightSecondary font-normal mt-4">Skills</p>
                        <RenderTags items={currUserInfo?.skills ?? []} title="" />
                    </div>
                </div>
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
                <UserProfileShareModal               
                    show={show}
                    close={closeModal}
                    copy={copy}
                    showTooltip={showTooltip}
                />
                {showIconSelector && (
                    <PfpSelectionModal
                        setSelectedIcon={setProfileIcon}
                        closeModal={closeIconSelector}
                    />
                )}
            </div>
        </div>
    );
};

export default UserProfileCard;
