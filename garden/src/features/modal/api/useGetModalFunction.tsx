import { ModalFunction } from "@/types";
import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

const getModalFunction = async (id: string): Promise<ModalFunction> => {
  try {
    const response = await axios.get(`/modal-functions/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching modal function");
  }
};

export const useGetModalFunction = (id: string) => {
  return useQuery({
    queryKey: ["modalFunction", id],
    queryFn: async () => {
      const response = await axios.get(`/modal-functions/${id}`);
      const modalFunction = response.data as ModalFunction;

      // Get the parent modal app to get ownership information
      const modalAppResponse = await axios.get(`/modal-apps/${modalFunction.modal_app_id}`);
      return {
        ...modalFunction,
        owner_identity_id: modalAppResponse.data.owner_identity_id
      };
    },
  });
};
