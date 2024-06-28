import React, { useState, useRef, useEffect } from "react";
import UserProfileInfo from "@/components/UserProfilePageComponents/UserProfileInfo";

const UserProfileTabs = () => {
    const [active, setActive] = useState("");
    const [stepsOverflow, setStepsOverflow] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [hasOverflow, setHasOverflow] = useState(false);

    const widthRef = useRef<HTMLParagraphElement>(null);
    const bottom = useRef<HTMLDivElement>(null);
    const top = useRef<HTMLButtonElement>(null);
    const div = useRef<HTMLDivElement>(null);

    // Scroll button for steps tab if there is overflow
    const scrollToBottom = () => {
        div.current?.scrollTo({
            top: div.current.scrollHeight,
            behavior: "smooth",
        });
    };

    const scrollToTop = () => {
        div.current?.scrollTo({ top: 0, behavior: "smooth" });
    };

    useEffect(() => {
        if (widthRef.current) {
            const container = widthRef.current;
            if (container!.offsetWidth < container!.scrollWidth) {
                setIsOverflowing(true);
            }
        }
    }, []);

    return (
        <div className="flex h-full w-full flex-col font-display w-9/12 rounded-b-lg border border-gray-200 shadow-sm hover:shadow-md">
            <div className="flex flex-col flex-grow pb-12">
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
            <div className="flex-grow pt-4 sm:pt-8 overflow-auto">
                {active === "" && (
                    <div className="flex justify-center w-full">
                        <UserProfileInfo />
                    </div>
                )}
                {active === "My Gardens" && (
                    <div className="px-6">
                        <p>My Gardens Section</p>
                        
                    </div>
                )}
                {active === "Saved Gardens" && (
                    <div className="px-6">
                        <p>Saved Gardens Section</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfileTabs;