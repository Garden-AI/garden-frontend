import axios from "@/api/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { ModalAppCreateRequest, ModalAppMetadataResponse } from "@/api/types";

const createModalApp = async (
  req: ModalAppCreateRequest,
): Promise<AxiosResponse<ModalAppMetadataResponse>> => {
  try {
    const response = await axios.post(`/modal-apps`, req);
    return response;
  } catch (error) {
    throw new Error("Error creating modal app");
  }
};

export const useCreateModalApp = () => {
  return useMutation<AxiosResponse<ModalAppMetadataResponse>, Error, ModalAppCreateRequest>({
    mutationFn: createModalApp,
  });
};
