import { Garden, GardenPatchRequest } from "@/types";
import axios from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface PatchGardenProps {
  doi: string;
  garden: GardenPatchRequest;
  successMessage?: string;
}

const patchGarden = async ({ doi, garden }: PatchGardenProps): Promise<Garden> => {
  try {
    const response = await axios.patch(`/gardens/${doi}`, garden);
    return response.data;
  } catch (error) {
    throw new Error(`Error patching garden: ${error}`);
  }
};

export const usePatchGarden = () => {
  const queryClient = useQueryClient();
  return useMutation<Garden, Error, PatchGardenProps, { previousGarden: Garden | undefined }>({
    mutationFn: patchGarden,
    onMutate: async ({ doi, garden }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["gardens", doi] });

      // Snapshot the previous value
      const previousGarden = queryClient.getQueryData<Garden>(["gardens", doi]);

      // Optimistically update to the new value
      if (previousGarden) {
        // Handle arrays that might be null in the patch but can't be null in the Garden type
        const updatedGarden = {
          ...previousGarden,
          // Keep required fields from previous garden
          doi: previousGarden.doi,
          owner_identity_id: previousGarden.owner_identity_id,
          // Handle optional arrays that can't be null
          authors: garden.authors ?? previousGarden.authors ?? [],
          contributors: garden.contributors ?? previousGarden.contributors ?? [],
          // Handle other fields from the patch
          title: garden.title ?? previousGarden.title,
          description: garden.description ?? previousGarden.description,
          year: garden.year ?? previousGarden.year,
          version: garden.version ?? previousGarden.version,
          is_archived: garden.is_archived ?? previousGarden.is_archived,
          doi_is_draft: garden.doi_is_draft ?? previousGarden.doi_is_draft,
          tags: garden.tags ?? previousGarden.tags ?? [],
        };

        queryClient.setQueryData<Garden>(["gardens", doi], updatedGarden);
      }

      return { previousGarden };
    },
    onError: (err, { doi }, context) => {
      console.error(err.message);
      if (err.message.includes("409")) {
        toast.error(
          `Failed to update garden: Garden must have at least one Model Author or one Gardener`,
        );
      } else {
        toast.error(
          "Updating garden metadata failed! Try again, and if it fails contact the Garden team.",
        );
      }
      queryClient.setQueryData(["gardens", doi], context?.previousGarden);
    },
    onSuccess: (data, input) => {
      // Update the cache with the new data
      queryClient.setQueryData(["gardens", data.doi], data);
      // Use custom success message if provided, otherwise use default
      toast.success(input.successMessage || "Garden updated successfully!");
    },
  });
};
