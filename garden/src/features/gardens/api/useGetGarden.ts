import { Garden } from "@/types";
import axios from "@/lib/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const getGarden = async (doi: string): Promise<Garden> => {
  try {
    const response = await axios.get(`/gardens/${doi}`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching garden by DOI");
  }
};

export const useGetGarden = (doi: string) => {
  const queryClient = useQueryClient();
  return useQuery<Garden, Error>({
    queryKey: ["gardens", doi],
    queryFn: () => getGarden(doi),
    select: (garden) => {
      garden.modal_functions?.forEach((fn) => {
        queryClient.setQueryData(["modalFunctions", fn.id], fn);
      });
      return garden;
    },
  });
};
