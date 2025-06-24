import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ModalFunction, ModalFunctionPatchRequest } from "@/types";
import axios from "@/lib/axios";

interface PatchModalFunctionParams {
  id: number;
  modalFunction: ModalFunctionPatchRequest;
}

export const usePatchModalFunction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, modalFunction }: PatchModalFunctionParams) => {
      const response = await axios.patch(`/modal-functions/${id}`, modalFunction);
      return response.data as ModalFunction;
    },
    onMutate: async ({ id, modalFunction }: PatchModalFunctionParams) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["modalFunctions", id] });

      // Snapshot the previous value
      const previousModalFunction = queryClient.getQueryData<ModalFunction>([
        "modalFunctions",
        id,
      ]);

      // Optimistically update to the new value
      if (previousModalFunction) {
        queryClient.setQueryData<ModalFunction>(["modalFunctions", id], {
          ...previousModalFunction,
          ...Object.fromEntries(
            Object.entries(modalFunction).filter(([_, value]) => value !== null),
          ),
        });
      }

      return { previousModalFunction };
    },
    onError: (err, { id }, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousModalFunction) {
        queryClient.setQueryData(["modalFunctions", id], context.previousModalFunction);
      }
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["modalFunctions", data.id] });
      // Invalidate all garden queries since we don't know which gardens contain this function
      await queryClient.invalidateQueries({ queryKey: ["gardens"] });
    },
  });
};
