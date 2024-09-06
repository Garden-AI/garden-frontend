import { useState, useEffect } from "react";
import { useGetUserInfo } from "@/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import NotFoundPage from "../../pages/NotFoundPage";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGlobusAuth } from "@/components/auth/useGlobusAuth";
import { toast } from "sonner";
import { useUpdateUserInfo } from "../../api/updateUserInfo";
import MultipleSelector from "@/components/ui/multiple-select";
import RenderTags from "../ui/renderTags";
import InputMask from "react-input-mask";
import { UpdateUserSchema } from "@/api/types";
import { number } from "zod";

const UserProfileInfo = () => {
  const [edit, setEdit] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const {
    data: currUserInfo,
    isLoading: fetchingUserInfoLoading,
    isError: fetchingUserInfoError,
    refetch,
  } = useGetUserInfo();
  const auth = useGlobusAuth();
  const { mutate: updateUser } = useUpdateUserInfo();

  const [userInfo, setUserInfo] = useState<Partial<UpdateUserSchema>>({
    username: "",
    name: "",
    email: "",
    phone_number: "",
    affiliations: [],
    skills: [],
    domains: [],
    profile_pic_id: undefined, // initially
  });

  useEffect(() => {
    if (currUserInfo) {
      setUserInfo({
        username: currUserInfo.username ?? "",
        name: currUserInfo.name ?? "",
        email: currUserInfo.email ?? "",
        phone_number: currUserInfo.phone_number ?? "",
        affiliations: currUserInfo.affiliations ?? [],
        skills: currUserInfo.skills ?? [],
        domains: currUserInfo.domains ?? [],
        profile_pic_id: currUserInfo.profile_pic_id
          ? Number(currUserInfo.profile_pic_id)
          : undefined,
      });
    }
  }, [currUserInfo]);

  useEffect(() => {
    if (isUpdating) {
      toast.loading("Updating profile...", { id: "updating-profile" });
    } else {
      toast.dismiss("updating-profile");
    }
  }, [isUpdating]);

  const handleSave = () => {
    if (!auth?.authorization?.user?.sub) {
      toast.error("You must be authenticated to save changes.");
      return;
    }
    const dataToSend = {
      username: userInfo.username,
      name: userInfo.name,
      email: userInfo.email,
      phone_number: userInfo.phone_number,
      affiliations: userInfo.affiliations,
      skills: userInfo.skills,
      domains: userInfo.domains,
      profile_pic_id: userInfo.profile_pic_id,
    } as UpdateUserSchema;

    console.log("Updating user info with data:", dataToSend);
    updateUser(dataToSend, {
      onSuccess: async (updatedData: any) => {
        setUserInfo({
          username: updatedData.username ?? "",
          name: updatedData.name ?? "",
          email: updatedData.email ?? "",
          phone_number: updatedData.phone_number ?? "",
          affiliations: updatedData.affiliations ?? [],
          skills: updatedData.skills ?? [],
          domains: updatedData.domains ?? [],
          profile_pic_id: updatedData.profile_pic_id ?? undefined,
        });
        await refetch();
        setEdit(false);
        setIsUpdating(false);
        toast.success("Profile updated successfully!");
      },
      onError: () => {
        setIsUpdating(false);
        toast.error("Failed to update profile. Please try again.");
      },
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "affiliations" || name === "skills" || name === "domains") {
      setUserInfo({ ...userInfo, [name]: value.split(",").map((item) => item.trim()) });
    } else {
      setUserInfo({ ...userInfo, [name]: value });
    }
  };

  const handleEdit = () => {
    setEdit(!edit);
  };

  if (fetchingUserInfoLoading) {
    return <LoadingSpinner />;
  }
  if (fetchingUserInfoError) {
    return <NotFoundPage />;
  }

  return (
    <div className="h-full w-full pb-20 pl-20 pr-20">
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-2 ">
          <p className="text-gray-600">Full Name</p>
          {edit ? (
            <input
              type="text"
              name="name"
              value={userInfo.name ?? ""}
              onChange={handleInputChange}
              placeholder="Full Name"
              className="w-full rounded border border-gray-300 px-2 py-1 focus:border-2 focus:border-green focus:outline-none focus:ring-0"
            />
          ) : (
            <p>{currUserInfo?.name ?? "No name entered yet."}</p>
          )}
        </div>
        <div className="space-y-2">
          <p className="text-gray-600">Phone Number</p>
          {edit ? (
            <div className="relative">
              <InputMask
                mask="+9 999 999 9999"
                value={userInfo.phone_number ?? ""}
                onChange={handleInputChange}
                maskChar=""
                name="phone_number"
                type="text"
                placeholder="+x xxx xxx xxxx"
                className="w-full rounded border border-gray-300 px-2 py-1 focus:border-2 focus:border-green focus:outline-none focus:ring-0"
              />
              <div className="absolute right-0 top-0 mr-2 mt-1 text-xs text-gray-500">
                Format: +(country code) xxx-xxx-xxxx
              </div>

            </div>
          ) : (
            <p>{currUserInfo?.phone_number ?? "No phone number entered yet."}</p>
          )}
        </div>
        <div className="space-y-2 ">
          <p className="text-gray-600">Email Address</p>
          {edit ? (
            <input
              type="email"
              name="email"
              value={userInfo.email ?? ""}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full rounded border border-gray-300 px-2 py-1 focus:border-2 focus:border-green focus:outline-none focus:ring-0"
            />
          ) : (
            <p>{currUserInfo?.email ?? "No email address entered yet."}</p>
          )}
        </div>
        <div className="space-y-2 ">
          {edit ? (
            <MultipleSelector
              placeholder="Edit institutions/affiliations"
              creatable
              value={userInfo.affiliations?.map((affiliation) => ({
                label: affiliation,
                value: affiliation,
              }))}
              onChange={(newValue: any) =>
                setUserInfo({
                  ...userInfo,
                  affiliations: newValue.map((item: any) => item.value),
                })
              }
              className="bg-white"
              maxSelected={5}
            />
          ) : (
            <RenderTags items={userInfo?.affiliations ?? []} title="Affiliations" />
          )}
        </div>
        <div className="space-y-2 ">
          {edit ? (
            <MultipleSelector
              placeholder="Edit skills"
              creatable
              value={userInfo.skills?.map((skill) => ({ label: skill, value: skill }))}
              onChange={(newValue: any) =>
                setUserInfo({
                  ...userInfo,
                  skills: newValue.map((item: any) => item.value),
                })
              }
              className="bg-white"
              maxSelected={10}
            />
          ) : (
            <RenderTags items={userInfo?.skills ?? []} title="Skills" />
          )}
        </div>
        <div className="space-y-2 ">
          {edit ? (
            <MultipleSelector
              placeholder="Edit domains"
              creatable
              value={userInfo.domains?.map((domain) => ({ label: domain, value: domain }))}
              onChange={(newValue: any) =>
                setUserInfo({
                  ...userInfo,
                  domains: newValue.map((item: any) => item.value),
                })
              }
              className="bg-white"
            />
          ) : (
            <RenderTags items={userInfo?.domains ?? []} title="Domains" />
          )}
        </div>
      </div>
      <hr className="mx-auto my-10 h-0.5 w-full border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
      <div className="flex justify-end">
        {edit ? (
          <div className="flex flex-row">
            <button
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "mr-2 flex flex-row items-center gap-2 rounded-lg border border-green bg-white px-2 py-1 text-sm text-green",
              )}
              onClick={handleEdit}
              disabled={!auth?.authorization?.user?.sub}
            >
              Cancel
            </button>
            <button
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "flex flex-row items-center gap-2 rounded-lg border border-gray-200 px-2 py-1 text-sm",
              )}
              onClick={handleSave}
              disabled={!auth?.authorization?.user?.sub}
            >
              Save Edits
            </button>
          </div>
        ) : (
          <button
            onClick={handleEdit}
            className="flex flex-row items-center gap-2 rounded-lg border border-gray-200 px-2 py-1 text-sm"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfileInfo;
