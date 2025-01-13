import axios from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import {ModalFileMetadataRequest, ModalFileMetadataResponse} from "@/types";
import { AxiosError } from "axios";
import { ApiError } from "../utils/garden.utils";

const validateModalFile = async (
  req: ModalFileMetadataRequest,
): Promise<ModalFileMetadataResponse> => {
  try {
    const response = await axios.post(`/modal-file-metadata`, req);
    return response.data;
  } catch (error: unknown) {
    console.log(error);
    if (error instanceof AxiosError) {
      throw ApiError.fromAxiosError(error);
    }
    throw error;
  }
};

export const useValidateModalFile = () => {
  return useMutation<ModalFileMetadataResponse, Error, ModalFileMetadataRequest>({
    mutationFn: validateModalFile,
  });
};
