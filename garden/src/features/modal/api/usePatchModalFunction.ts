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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["modalFunction", data.id.toString()] });
      
      queryClient.invalidateQueries({ queryKey: ["gardens"] });
      queryClient.invalidateQueries({ queryKey: ["search"] });
    },
  });
}; 