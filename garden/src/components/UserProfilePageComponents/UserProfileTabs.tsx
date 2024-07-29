import { useState, useRef, useEffect } from "react";
import UserProfileInfo from "@/components/UserProfilePageComponents/UserProfileInfo";
import MyGardens from "@/components/UserProfilePageComponents/MyGardens";
import SavedGardens from "@/components/UserProfilePageComponents/SavedGardens";

const UserProfileTabs = () => {
    const [active, setActive] = useState("");
    const [isOverflowing, setIsOverflowing] = useState(false);

    const widthRef = useRef<HTMLParagraphElement>(null);
    const div = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (widthRef.current) {
            const container = widthRef.current;
            if (container!.offsetWidth < container!.scrollWidth) {
                setIsOverflowing(true);
            }
        }
    }, []);

    return (
        <div className="flex h-3/4 w-full flex-col font-display w-9/12 rounded-b-lg border border-gray-200 shadow-sm hover:shadow-md">
            <div className="flex flex-col flex-grow">
                <div className="flex h-12 justify-evenly">
                    <button
                        className={`w-full border-b-4 ${active === "" || active === "Profile Information" ? "border-green bg-green bg-opacity-30" : "bg-gray-100 hover:border-green hover:bg-gradient-to-b hover:from-gray-100 hover:from-70% hover:to-green"}`}
                        onClick={() => setActive("")}
                    >
                        Profile Information
                    </button>
                    <button
                        className={`w-full border-b-4 ${active === "My Gardens" ? "border-green bg-green bg-opacity-30" : "bg-gray-100 hover:border-green hover:bg-gradient-to-b hover:from-gray-100 hover:from-70% hover:to-green"}`}
                        onClick={() => setActive("My Gardens")}
                    >
                        My Gardens
                    </button>
                    <button
                        className={`w-full border-b-4 ${active === "Saved Gardens" ? "border-green bg-green bg-opacity-30" : "bg-gray-100 hover:border-green hover:bg-gradient-to-b hover:from-gray-100 hover:from-70% hover:to-green"}`}
                        onClick={() => setActive("Saved Gardens")}
                    >
                        Saved Gardens
                    </button>
                </div>
            </div>
            <div className="flex-grow pt-4 sm:pt-8 overflow-auto h-96">
                {active === "" && (
                    <div className="flex justify-center w-full">
                        <UserProfileInfo />
                    </div>
                )}
                {active === "My Gardens" && (
                    <div className="px-6">
                        <MyGardens />
                    </div>
                )}
                {active === "Saved Gardens" && (
                    <div className="px-6">
                        <SavedGardens />
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfileTabs;