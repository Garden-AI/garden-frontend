import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { HpcFunctionPatchRequest, HpcFunctionMetadataResponse } from "@/types";
import { toast } from "sonner";

export const usePatchHpcFunction = (functionId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: HpcFunctionPatchRequest) => {
      if (functionId === undefined) {
        throw new Error("Cannot patch HPC function without valid ID");
      }
      const response = await axios.patch(`/hpc/functions/${functionId}`, data);
      return response.data as HpcFunctionMetadataResponse;
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["hpc-functions"] });
      await queryClient.cancelQueries({ queryKey: ["hpc-functions", functionId] });

      const previousFunctions = queryClient.getQueryData(["hpc-functions"]);
      const previousFunction = queryClient.getQueryData(["hpc-functions", functionId]);

      queryClient.setQueryData(["hpc-functions"], (old: HpcFunctionMetadataResponse[] | undefined) => {
        if (!old) return old;
        return old.map((func) =>
          func.id === functionId ? { ...func, ...newData } : func
        );
      });

      queryClient.setQueryData(["hpc-functions", functionId], (old: HpcFunctionMetadataResponse | undefined) => {
        if (!old) return old;
        return { ...old, ...newData };
      });

      return { previousFunctions, previousFunction };
    },
    onError: (error, _, context) => {
      if (context?.previousFunctions) {
        queryClient.setQueryData(["hpc-functions"], context.previousFunctions);
      }
      if (context?.previousFunction) {
        queryClient.setQueryData(["hpc-functions", functionId], context.previousFunction);
      }

      toast.error(`Failed to update function: ${error.message}`);
    },
    onSuccess: (updatedFunction) => {
      queryClient.setQueryData(["hpc-functions", functionId], updatedFunction);

      // TODO: This invalidates ALL gardens. Make it more surgical when hpcFunction.garden_doi becomes available.
      queryClient.invalidateQueries({ queryKey: ["gardens"] });

      toast.success("Function updated successfully");
    },
  });
};
