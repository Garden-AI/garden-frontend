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
      await queryClient.cancelQueries({ queryKey: ["modalFunction", id.toString()] });

      // Snapshot the previous value
      const previousModalFunction = queryClient.getQueryData<ModalFunction>(["modalFunction", id.toString()]);

      // Optimistically update to the new value
      if (previousModalFunction) {
        queryClient.setQueryData<ModalFunction>(["modalFunction", id.toString()], {
          ...previousModalFunction,
          ...modalFunction
        });
      }

      return { previousModalFunction };
    },
    onError: (err, { id }, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousModalFunction) {
        queryClient.setQueryData(["modalFunction", id.toString()], context.previousModalFunction);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["modalFunction", data.id.toString()] });
      queryClient.invalidateQueries({ queryKey: ["gardens"] });
      queryClient.invalidateQueries({ queryKey: ["search"] });
    },
  });
}; 