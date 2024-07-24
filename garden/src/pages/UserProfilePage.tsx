import React, { useState, useRef, useEffect } from "react";
import UserProfileTabs from "../components/UserProfilePageComponents/UserProfileTabs";
import UserProfileCard from "../components/UserProfilePageComponents/UserProfileCard";

const UserProfilePage = () => {

    return (
        <div className="flex h-full w-full flex-row justify-center gap-10 p-10">
            <UserProfileCard/>
            <UserProfileTabs/>
        </div>
    )
}

export default UserProfilePage;