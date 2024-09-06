import React, { useState } from "react";
import { X } from "lucide-react";
import { useUpdateUserInfo } from "@/api/updateUserInfo";
import { useGetUserInfo } from "@/api";
import { IconType, icons } from "./icons";

type PfpSelectionModalProps = {
  setSelectedIcon: (icon: IconType | null) => void;
  closeModal: () => void;
};

const PfpSelectionModal = ({ setSelectedIcon, closeModal }: PfpSelectionModalProps) => {
  const {
    data: currUserInfo,
    isLoading: getUserInfoLoading,
    isError: getUserInfoError,
  } = useGetUserInfo();
  const { mutate: updatePfp_id } = useUpdateUserInfo();
  const { refetch: refetchUserInfo } = useGetUserInfo();

  interface pfp_id_updateRequest {
    profile_pic_id: number;
  }

  const [curr_pfp_id, set_new_pfp_id] = useState<pfp_id_updateRequest>({
    profile_pic_id: currUserInfo?.profile_pic_id ? Number(currUserInfo.profile_pic_id) : 0,
  });

  const handlePfpClick = (iconId: number, icon: JSX.Element) => {
    set_new_pfp_id({ profile_pic_id: iconId });

    const dataToSend: pfp_id_updateRequest = {
      profile_pic_id: iconId,
    };

    updatePfp_id(dataToSend, {
      onSuccess: (updatedData: any) => {
        set_new_pfp_id({
          profile_pic_id: updatedData.profile_pic_id ? Number(updatedData.profile_pic_id) : 0,
        });
        setSelectedIcon(icons.find((icon) => icon.id === iconId) || null);
        refetchUserInfo();
        closeModal();
      },
      onError: () => {
        set_new_pfp_id({
          profile_pic_id: currUserInfo?.profile_pic_id ? Number(currUserInfo.profile_pic_id) : 0,
        });
      },
    });
    console.log("Updated pfp_id with new svg: ", dataToSend);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="relative h-96 w-1/3 overflow-auto rounded-lg bg-white p-10">
        <div className="flex w-full flex-row">
          <h2 className="mb-10 text-xl text-gray-500">Select a Profile Picture Icon</h2>
          <X
            className="absolute right-4 top-4 mr-2 text-gray-500 hover:cursor-pointer"
            onClick={closeModal}
          />
        </div>
        <div className="flex flex-wrap gap-10">
          {icons.map((iconData) => (
            <div
              key={iconData.id}
              onClick={() => handlePfpClick(iconData.id, iconData.svg)}
              className="flex h-36 w-36 cursor-pointer items-center justify-center rounded-full bg-primary p-2"
            >
              {iconData.svg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PfpSelectionModal;
