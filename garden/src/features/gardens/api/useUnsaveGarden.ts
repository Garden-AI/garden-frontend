import { Garden } from "@/types";
import axios from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useGlobusAuth } from "@globus/react-auth-context";

interface SaveGardenProps {
  doi: string;
  uuid?: string;
}

const unsaveGarden = async ({ doi, uuid }: SaveGardenProps): Promise<Garden> => {
  if (!uuid) {
    throw new Error("User is not authenticated");
  }
  try {
    const response = await axios.delete(`/users/${uuid}/saved/gardens/${doi}`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching garden by DOI");
  }
};

export const useUnsaveGarden = (doi: string) => {
  const auth = useGlobusAuth();
  const uuid = auth?.authorization?.user?.sub;
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["garden", "unsave", doi],
    mutationFn: () => unsaveGarden({ doi, uuid }),
    onSuccess: () => {
      queryClient.setQueryData(["user", "me"], (oldData: any) => {
        return {
          ...oldData,
          saved_garden_dois: oldData.saved_garden_dois.filter(
            (gardenDoi: string) => gardenDoi !== doi,
          ),
        };
      });
      toast.success("Garden successfully removed from your profile.");
    },
    onError: (error) => {
      toast.error("Error removing bookmark from garden.");
    },
  });
};
