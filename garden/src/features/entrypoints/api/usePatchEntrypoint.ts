import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import axios from "@/lib/axios";
import { Entrypoint, EntrypointPatchRequest } from "@/types";

interface PatchEntrypointProps {
  doi: string;
  entrypoint: EntrypointPatchRequest;
}

const patchEntrypoint = async ({ doi, entrypoint }: PatchEntrypointProps): Promise<Entrypoint> => {
  try {
    const response = await axios.patch<Entrypoint>(`/entrypoints/${doi}`, entrypoint);
    return response.data;
  } catch (error) {
    throw new Error("Error patching entrypoint");
  }
};

export const usePatchEntrypoint = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<Entrypoint, Error, PatchEntrypointProps, Entrypoint>({
    mutationFn: patchEntrypoint,
    onSuccess: (data) => {
      queryClient.setQueryData<Entrypoint>(["entrypoint", data.doi], data);
      navigate(`/entrypoint/${encodeURIComponent(data.doi)}`);
      toast.success("Entrypoint updated successfully!");
    },
  });
};
