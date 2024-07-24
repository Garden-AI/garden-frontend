import React, { useState } from "react";
import { useGetUserInfo } from "../../api/getUserInfo";
import LoadingSpinner from "../../components/LoadingSpinner";
import NotFoundPage from "../../pages/NotFoundPage";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGlobusAuth } from "@/components/globus-auth-context/useGlobusAuth";

const UserProfileInfo = () => {
    const initialInfoState = {
        id: null,
        name: '',
        email: '',
        phone: '',
        affiliations: '',
        domains: '',
        skills: ''
    }
    const [info, setInfo] = useState(initialInfoState);
    const [edit, setEdit] = useState(false);
    const { data: currUserInfo, isLoading, isError } = useGetUserInfo();
    const auth = useGlobusAuth();

    const handleEdit = () => {
        setEdit(true);
    };

    const handleSave = (e: any) => {
        e.preventDefault();
        //saveInfo();
        setEdit(false);
    };

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setInfo({ ...info, [name]: value });
    };


    if (isLoading) {
        return <LoadingSpinner />;
    }
    if (isError) {
        return <NotFoundPage />;
    }

    return (
        <div className="pr-20 pl-20 pb-20 w-full">
            <div className="grid grid-cols-2 gap-8">
                <div className = "space-y-2 ">
                    <p className="text-gray-600">Full Name</p>
                    {edit ? (
                        <input
                            type="text"
                            name="name"
                            value={currUserInfo?.name ?? ''}
                            onChange={handleInputChange}
                            placeholder="Full Name"
                            className="border border-gray-300 rounded px-2 py-1 w-full focus:border-green focus:outline-none focus:ring-0 focus:border-2"
                        />
                    ) : (
                        <p>{currUserInfo?.name ?? 'No name entered yet.'}</p>
                    )}
                </div>
                <div className = "space-y-2 ">
                    <p className="text-gray-600">Phone Number</p>
                    {edit ? (
                        <input
                            type="text"
                            name="phone"
                            value={currUserInfo?.phone_number ?? ''}
                            onChange={handleInputChange}
                            placeholder="Phone Number"
                            className="border border-gray-300 rounded px-2 py-1 w-full focus:border-green focus:outline-none focus:ring-0 focus:border-2"
                        />
                    ) : (
                        <p>{currUserInfo?.phone_number ?? 'No phone number entered yet.'}</p>
                    )}
                </div>
                <div className = "space-y-2 ">
                    <p className="text-gray-600">Email Address</p>
                    {edit ? (
                        <input
                            type="email"
                            name="email"
                            value={currUserInfo?.email ?? ''}
                            onChange={handleInputChange}
                            placeholder="Email"
                            className="border border-gray-300 rounded px-2 py-1 w-full focus:border-green focus:outline-none focus:ring-0 focus:border-2"
                        />
                    ) : (
                        <p>{currUserInfo?.email ?? 'No email address entered yet.'}</p>
                    )}
                </div>
                <div className = "space-y-2 ">
                    <p className="text-gray-600">Institutions/Affiliations</p>
                    {edit ? (
                        <input
                            type="text"
                            name="affiliations"
                            value={currUserInfo?.affiliations ?? []}
                            onChange={handleInputChange}
                            placeholder="Affiliations"
                            className="border border-gray-300 rounded px-2 py-1 w-full focus:border-green focus:outline-none focus:ring-0 focus:border-2"
                        />
                    ) : (
                        <p>{currUserInfo?.affiliations ?? 'No affiliations listed yet.'}</p>
                    )}
                </div>
                <div className = "space-y-2 ">
                    <p className="text-gray-600">Skills (separated with commas)</p>
                    {edit ? (
                        <input
                            type="text"
                            name="skills"
                            value={currUserInfo?.skills ?? []}
                            onChange={handleInputChange}
                            placeholder="Skills"
                            className="border border-gray-300 rounded px-2 py-1 w-full focus:border-green focus:outline-none focus:ring-0 focus:border-2"
                        />
                    ) : (
                        <p>{currUserInfo?.skills ?? 'No skills listed yet.'}</p>
                    )}
                </div>
                <div className = "space-y-2 ">
                    <p className="text-gray-600">Domain(s) (separated with commas)</p>
                    {edit ? (
                        <input
                                type="text"
                                name="domains"
                                value={currUserInfo?.domains ?? []}
                                onChange={handleInputChange}
                                placeholder="Domains"
                                className="border border-gray-300 rounded px-2 py-1 w-full focus:border-green focus:outline-none focus:ring-0 focus:border-2"
                            />
                    ) : (
                        <p>{currUserInfo?.domains ?? 'No domains listed yet.'}</p>
                    )}
                </div>
            </div>
            <hr className="h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50 my-10 mx-auto w-full" />
            <div className="flex justify-end">
                {edit ? (
                    <button
                        className={cn(
                        buttonVariants({ variant: "default", size: "lg" }),
                        "flex flex-row items-center gap-2 rounded-lg border border-gray-200 px-2 py-1 text-sm"
                        )}
                        onClick={handleSave}
                        disabled={!auth?.authorization?.user?.sub}
                    >
                        Save Edits
                    </button>
                ) : (
                    <button onClick={handleEdit} className="flex flex-row items-center gap-2 rounded-lg border border-gray-200 px-2 py-1 text-sm">Edit Profile</button>
                )}
            </div>
        </div>
    );
};

export default UserProfileInfo;
;