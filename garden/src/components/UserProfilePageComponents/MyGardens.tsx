import React, { useState, useEffect } from 'react';
import { Garden } from "../../types";
import GardenBox from "@/components/GardenBox";
import { Link } from 'react-router-dom';
import { useGetUserGardens} from "../../api/getUserGardens";
import { useGetUserInfo } from "../../api/getUserInfo";
import LoadingSpinner from "../../components/LoadingSpinner";
import NotFoundPage from "../../pages/NotFoundPage";

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
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="green"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-circle-plus"
            >
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12h8" />
                <path d="M12 8v8" />
            </svg>
            </Link>
            </div>
            <div className="mb-6">
                {userGardens && userGardens.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {userGardens.map((garden: Garden, index: number) => (
                        <GardenBox garden={garden} key={index} />
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
