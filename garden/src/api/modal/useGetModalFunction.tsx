import { ModalFunction } from "@/api/types";
import axios from "../axios";
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
  return useQuery<ModalFunction, Error>({
    queryKey: ["modal-apps", id],
    queryFn: () => getModalFunction(id),
  });
};
