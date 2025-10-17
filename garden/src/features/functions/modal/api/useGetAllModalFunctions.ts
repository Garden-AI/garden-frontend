import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { ModalFunction } from "@/types";

export const useGetAllModalFunctions = () => {
  return useQuery({
    queryKey: ["allModalFunctions"],
    queryFn: async (): Promise<ModalFunction[]> => {
      const response = await axios.get("/modal-functions");
      return response.data;
    },
  });
};
