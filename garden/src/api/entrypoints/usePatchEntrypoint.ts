import { Entrypoint, EntrypointPatchRequest } from "@/api/types";
import axios from "../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface PatchEntrypointProps {
  doi: string;
  entrypoint: EntrypointPatchRequest;
}
const patchEntrypoint = async ({ doi, entrypoint }: PatchEntrypointProps): Promise<Entrypoint> => {
  try {
    const response = await axios.patch(`/entrypoints/${doi}`, entrypoint);
    return response.data;
  } catch (error) {
    throw new Error("Error patching entrypoint");
  }
};

export const usePatchEntrypoint = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation<Entrypoint, Error, PatchEntrypointProps, unknown>({
    mutationFn: patchEntrypoint,
    onSuccess: (data) => {
      queryClient.setQueryData(["entrypoint", data.doi], (oldData: Entrypoint) => data);

      navigate(`/entrypoint/${encodeURIComponent(data.doi)}`);
      toast.success("Entrypoint updated successfully!");
    },
  });
};
