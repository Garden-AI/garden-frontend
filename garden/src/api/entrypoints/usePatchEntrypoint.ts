import { Entrypoint, EntrypointPatchRequest } from "@/api/types";
import axios from "../axios";
import { useMutation } from "@tanstack/react-query";

interface PatchEntrypointProps {
  doi: string;
  entrypoint: EntrypointPatchRequest;
}
const patchEntrypoint = async ({
  doi,
  entrypoint,
}: PatchEntrypointProps): Promise<Entrypoint> => {
  try {
    const response = await axios.patch(`/entrypoints/${doi}`, entrypoint);
    return response.data;
  } catch (error) {
    throw new Error("Error patching entrypoint");
  }
};

export const usePatchEntrypoint = () => {
  return useMutation<Entrypoint, Error, PatchEntrypointProps, unknown>({
    mutationFn: patchEntrypoint,
  });
};
