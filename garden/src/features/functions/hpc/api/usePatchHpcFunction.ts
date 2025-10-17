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
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["hpc-functions"] });
      await queryClient.cancelQueries({ queryKey: ["hpc-functions", functionId] });

      // Snapshot previous values
      const previousFunctions = queryClient.getQueryData(["hpc-functions"]);
      const previousFunction = queryClient.getQueryData(["hpc-functions", functionId]);

      // Optimistically update function list
      queryClient.setQueryData(["hpc-functions"], (old: HpcFunctionMetadataResponse[] | undefined) => {
        if (!old) return old;
        return old.map((func) =>
          func.id === functionId ? { ...func, ...newData } : func
        );
      });

      // Optimistically update single function
      queryClient.setQueryData(["hpc-functions", functionId], (old: HpcFunctionMetadataResponse | undefined) => {
        if (!old) return old;
        return { ...old, ...newData };
      });

      return { previousFunctions, previousFunction };
    },
    onError: (error, _, context) => {
      // Rollback on error
      if (context?.previousFunctions) {
        queryClient.setQueryData(["hpc-functions"], context.previousFunctions);
      }
      if (context?.previousFunction) {
        queryClient.setQueryData(["hpc-functions", functionId], context.previousFunction);
      }

      toast.error(`Failed to update function: ${error.message}`);
    },
    onSuccess: (updatedFunction) => {
      // Update cache with server response
      queryClient.setQueryData(["hpc-functions", functionId], updatedFunction);

      // Invalidate and refetch
      // TODO: This is too broad - invalidates ALL gardens. Make it more surgical if hpcFunction.garden_doi becomes available in HpcFunctionMetadataResponse.
      queryClient.invalidateQueries({ queryKey: ["gardens"] });

      toast.success("Function updated successfully");
    },
  });
};
