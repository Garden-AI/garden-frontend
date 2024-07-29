import { useState, useEffect } from "react";
import { useGetUserInfo } from "../../api/getUserInfo";
import LoadingSpinner from "../../components/LoadingSpinner";
import NotFoundPage from "../../pages/NotFoundPage";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGlobusAuth } from "@/components/auth/useGlobusAuth";
import { toast } from "sonner";
import { useUpdateUserInfo } from '../../api/updateUserInfo';
import MultipleSelector from "@/components/ui/multiple-select";
import RenderTags from "../ui/renderTags";
import InputMask from 'react-input-mask';

const UserProfileInfo = () => {
    const [edit, setEdit] = useState(false);
    const { data: currUserInfo, isLoading: fetchingUserInfoLoading, isError: fetchingUserInfoError } = useGetUserInfo();
    const auth = useGlobusAuth();
    const { mutate: updateUser } = useUpdateUserInfo();

    interface userUpdateRequest {
        username?: string;
        name?: string;
        email?: string;
        phone?: string;
        affiliations?: string[];
        skills?: string[];
        domains?: string[];
        pfp_id?: number;
    }

    const [userInfo, setUserInfo] = useState<userUpdateRequest>({
        username: "",
        name: "",
        email: "",
        phone: "",
        affiliations: [],
        skills: [],
        domains: [],
        pfp_id: undefined,
    });

    useEffect(() => {
        if (currUserInfo) {
            setUserInfo({
                username: currUserInfo.username ?? "",
                name: currUserInfo.name ?? "",
                email: currUserInfo.email ?? "",
                phone: currUserInfo.phone_number ?? "",
                affiliations: currUserInfo.affiliations ?? [],
                skills: currUserInfo.skills ?? [],
                domains: currUserInfo.domains ?? [],
                pfp_id: currUserInfo.profile_pic_id ? Number(currUserInfo.profile_pic_id) : undefined,
            });
        }
    }, [currUserInfo]);

    const handleSave = () => {
        if (!auth?.authorization?.user?.sub) {
            toast.error("You must be authenticated to save changes.");
            return;
        } 
        const dataToSend: userUpdateRequest = {
            username: userInfo.username,
            name: userInfo.name,
            email: userInfo.email,
            phone: userInfo.phone,
            affiliations: userInfo.affiliations,
            skills: userInfo.skills,
            domains: userInfo.domains,
            pfp_id: userInfo.pfp_id ? Number(userInfo.pfp_id) : undefined,
        };
        
        console.log("Updating user info with data:", dataToSend);
        updateUser(dataToSend, {
            onSuccess: (updatedData: any) => {
                setUserInfo({
                    username: updatedData.username ?? "",
                    name: updatedData.name ?? "",
                    email: updatedData.email ?? "",
                    phone: updatedData.phone_number ?? "",
                    affiliations: updatedData.affiliations ?? [],
                    skills: updatedData.skills ?? [],
                    domains: updatedData.domains ?? [],
                    pfp_id: updatedData.profile_pic_id ? Number(updatedData.profile_pic_id) : undefined,
                });
                setEdit(false);
            }
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'affiliations' || name === 'skills' || name === 'domains') {
            setUserInfo({ ...userInfo, [name]: value.split(',').map(item => item.trim()) });
        } else {
            setUserInfo({ ...userInfo, [name]: value });
        }
    };

    const handleEdit = () => {
        setEdit(!edit);
    }

    if (fetchingUserInfoLoading) {
        return <LoadingSpinner />;
    }
    if (fetchingUserInfoError) {
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
                            value={userInfo.name ?? ''}
                            onChange={handleInputChange}
                            placeholder="Full Name"
                            className="border border-gray-300 rounded px-2 py-1 w-full focus:border-green focus:outline-none focus:ring-0 focus:border-2"
                        />
                    ) : (
                        <p>{currUserInfo?.name ?? 'No name entered yet.'}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <p className="text-gray-600">Phone Number</p>
                    {edit ? (
                            <div className="relative">
                            <InputMask
                                mask="+9 999 999 9999"
                                value={userInfo.phone ?? ''}
                                onChange={handleInputChange}
                                maskChar=""
                                name="phone"
                                type="text"
                                placeholder="+x xxx xxx xxxx"
                                className="border border-gray-300 rounded px-2 py-1 w-full focus:border-green focus:outline-none focus:ring-0 focus:border-2"
                            />
                            <div className="absolute top-0 right-0 mt-1 mr-2 text-gray-500 text-xs">
                                Format: +(country code) xxx-xxx-xxxx
                            </div>
                        </div>
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
                            value={userInfo.email ?? ''}
                            onChange={handleInputChange}
                            placeholder="Email"
                            className="border border-gray-300 rounded px-2 py-1 w-full focus:border-green focus:outline-none focus:ring-0 focus:border-2"
                        />
                    ) : (
                        <p>{currUserInfo?.email ?? 'No email address entered yet.'}</p>
                    )}
                </div>
                <div className = "space-y-2 ">
                    {edit ? (
                        <MultipleSelector
                            placeholder="Edit institutions/affiliations"
                            creatable
                            value={userInfo.affiliations?.map(affiliation => ({ label: affiliation, value: affiliation }))}
                            onChange={(newValue: any) => setUserInfo({
                            ...userInfo,
                            affiliations: newValue.map((item: any) => item.value)
                            })}
                            className="bg-white"
                        />
                    ) : (
                        <RenderTags items={userInfo?.affiliations ?? []} title="Affiliations" />
                    )}
                </div>
                <div className = "space-y-2 ">
                    {edit ? (
                        <MultipleSelector
                            placeholder="Edit skills"
                            creatable
                            value={userInfo.skills?.map(skill => ({ label: skill, value: skill }))}
                            onChange={(newValue: any) => setUserInfo({
                            ...userInfo,
                            skills: newValue.map((item: any) => item.value)
                            })}
                            className="bg-white"
                        />
                    ) : (
                        <RenderTags items={userInfo?.skills ?? []} title="Skills" />
                    )}
                </div>
                <div className = "space-y-2 ">
                    {edit ? (
                        <MultipleSelector
                            placeholder="Edit domains"
                            creatable
                            value={userInfo.domains?.map(domain => ({ label: domain, value: domain }))}
                            onChange={(newValue: any) => setUserInfo({
                            ...userInfo,
                            domains: newValue.map((item: any) => item.value)
                            })}
                            className="bg-white"
                        />
                    ) : (
                        <RenderTags items={userInfo?.domains ?? []} title="Domains" />
                    )}
                </div>
            </div>
            <hr className="h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50 my-10 mx-auto w-full" />
            <div className="flex justify-end">
                {edit ? (
                    <div className="flex flex-row">
                        <button
                            className={cn(
                            buttonVariants({ variant: "default", size: "lg" }),
                            "flex flex-row items-center gap-2 rounded-lg border border-green px-2 py-1 text-sm mr-2 bg-white text-green"
                            )}
                            onClick={handleEdit}
                            disabled={!auth?.authorization?.user?.sub}
                        >
                        Cancel
                        </button>
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
                </div>
                ) : (
                    <button onClick={handleEdit} className="flex flex-row items-center gap-2 rounded-lg border border-gray-200 px-2 py-1 text-sm">Edit Profile</button>
                )}
            </div>
        </div>
    );
};

export default UserProfileInfo;
;