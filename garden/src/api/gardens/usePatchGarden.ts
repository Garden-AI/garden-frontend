import { Garden, GardenPatchRequest } from "@/api/types";
import axios from "../axios";
import { useMutation } from "@tanstack/react-query";

interface PatchGardenProps {
  doi: string;
  garden: GardenPatchRequest;
}
const patchGarden = async ({
  doi,
  garden,
}: PatchGardenProps): Promise<Garden> => {
  try {
    const response = await axios.patch(`/gardens/${doi}`, garden);
    return response.data;
  } catch (error) {
    throw new Error("Error patching garden");
  }
};

export const usePatchGarden = () => {
  return useMutation<Garden, Error, PatchGardenProps, unknown>({
    mutationFn: patchGarden,
  });
};
