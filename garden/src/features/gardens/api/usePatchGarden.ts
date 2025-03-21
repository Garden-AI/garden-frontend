import { Garden, GardenPatchRequest } from "@/types";
import axios from "@/lib/axios";
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
  return useMutation<Garden, Error, PatchGardenProps, { previousGarden: Garden | undefined }>({
    mutationFn: patchGarden,
    onMutate: async ({ doi, garden }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["garden", doi] });

      // Snapshot the previous value
      const previousGarden = queryClient.getQueryData<Garden>(["garden", doi]);

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
          is_test: garden.is_test ?? previousGarden.is_test,
          is_archived: garden.is_archived ?? previousGarden.is_archived,
          doi_is_draft: garden.doi_is_draft ?? previousGarden.doi_is_draft,
          tags: garden.tags ?? previousGarden.tags ?? [],
        };

        queryClient.setQueryData<Garden>(["garden", doi], updatedGarden);
      }

      return { previousGarden };
    },
    onError: (err, { doi }, context) => {
      // If the mutation fails, use the context to roll back
      if (context?.previousGarden) {
        queryClient.setQueryData(["garden", doi], context.previousGarden);
      }
      toast.error("Failed to update garden");
    },
    onSuccess: (data) => {
      // Update the cache with the new data
      queryClient.setQueryData(["garden", data.doi], data);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["garden", data.doi] });
      queryClient.invalidateQueries({ queryKey: ["gardens"] });
      queryClient.invalidateQueries({ queryKey: ["search"] });
      
      toast.success("Garden updated successfully!");
    },
  });
};
