import { Garden } from "@/types";
import axios from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useGlobusAuth } from "@globus/react-auth-context";

interface SaveGardenProps {
  doi: string;
  uuid?: string;
}

const saveGarden = async ({ doi, uuid }: SaveGardenProps): Promise<Garden> => {
  if (!uuid) {
    throw new Error("User not authenticated");
  }
  try {
    const response = await axios.put(`/users/${uuid}/saved/gardens/${doi}`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching garden by DOI");
  }
};

export const useSaveGarden = (doi: string) => {
  const auth = useGlobusAuth();
  const uuid = auth?.authorization?.user?.sub;
  const queryClient = useQueryClient();
  return useMutation<Garden, Error>({
    mutationKey: ["garden", "save", doi],
    mutationFn: () => saveGarden({ doi, uuid }),
    onSuccess: () => {
      queryClient.setQueryData(["user", "me"], (oldData: any) => {
        return {
          ...oldData,
          saved_garden_dois: [...oldData.saved_garden_dois, doi],
        };
      });

      toast.success("Garden saved to your profile. You can view it on your profile page.");
    },
    onError: (error) => {
      toast.error("Error saving garden");
    },
  });
};
