import axios from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import {ModalFileMetadataRequest, ModalFileMetadataResponse} from "@/types";

const validateModalFile = async (
  req: ModalFileMetadataRequest,
): Promise<ModalFileMetadataResponse> => {
  try {
    const response = await axios.post(`/modal-file-metadata`, req);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(`File was invalid: ${error.response.data.detail}`);
  }
};

export const useValidateModalFile = () => {
  return useMutation<ModalFileMetadataResponse, Error, ModalFileMetadataRequest>({
    mutationFn: validateModalFile,
  });
};
