import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const useDeleteHpcEndpoint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (endpointId: number) => {
      await axios.delete(`/hpc/endpoints/${endpointId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hpc-endpoints"] });
      toast.success("Endpoint deleted successfully");
    },
    onError: (error: AxiosError) => {
      const detail = error.response?.data?.detail as string | undefined;
      toast.error(
        detail || "Cannot delete endpoint - it may be in use by existing functions"
      );
    },
  });
};
