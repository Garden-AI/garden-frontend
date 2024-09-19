import { Garden, GardenPatchRequest } from "@/api/types";
import axios from "../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface PatchGardenProps {
  doi: string;
  garden: GardenPatchRequest;
}
const patchGarden = async ({ doi, garden }: PatchGardenProps): Promise<Garden> => {
  try {
    const response = await axios.patch(`/gardens/${doi}`, garden);
    return response.data;
  } catch (error) {
    throw new Error("Error patching garden");
  }
};

export const usePatchGarden = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation<Garden, Error, PatchGardenProps, unknown>({
    mutationFn: patchGarden,
    onSuccess: (data) => {
      queryClient.setQueryData(["garden", data.doi], (oldData: Garden) => data);
      navigate(`/garden/${encodeURIComponent(data.doi)}`);
      toast.success("Garden updated successfully!");
    },
  });
};
