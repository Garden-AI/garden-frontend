import { HpcFunctionMetadataResponse as HpcFunction } from "@/types";
import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

const getHpcFunction = async (id: string): Promise<HpcFunction> => {
  const response = await axios.get(`/hpc/functions/${id}`);
  return response.data;
};

export const useGetHpcFunction = (id: string) => {
  return useQuery<HpcFunction, Error>({
    queryKey: ["hpc-functions", parseInt(id)],
    queryFn: () => getHpcFunction(id),
  });
};
