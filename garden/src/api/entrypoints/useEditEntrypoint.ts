import axios from "../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Entrypoint,
  EntrypointCreateRequest,
  EntrypointPatchRequest,
} from "@/api/types";
import { useNavigate } from "react-router-dom";

const patchEntrypoint = async (
  doi: string,
  entrypoint: EntrypointPatchRequest,
) => {
  try {
    const response = await axios.patch(`/entrypoints/${doi}`, entrypoint, {
      headers: {
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user's entrypoint:", error);
    throw new Error("Error updating user's entrypoint.");
  }
};

export const usePatchEntrypoint = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: ({
      doi,
      entrypoint,
    }: {
      doi: string;
      entrypoint: EntrypointPatchRequest;
    }) => patchEntrypoint(doi, entrypoint),

    onError: (error) => {
      console.log(error);
      toast.error("Failed to update the entrypoint.");
    },

    onSuccess: (data: Entrypoint) => {
      console.log("Updated user's entrypoint:", data);
      queryClient.setQueryData(
        ["entrypoint", data.doi],
        (oldData: Entrypoint) => data,
      );

      toast.success("Entrypoint updated successfully!");
      navigate(`/entrypoint/${encodeURIComponent(data.doi)}`);
    },
  });
};
