import axios from "@/api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface ModalFileValidationRequest {
  file: File;
}

interface ModalFileValidationResponse {
  is_valid: boolean;
  function_names: string[];
  pip_requirements: string[];
  base_image_requirements: string[];
}

const validateModalFile = async (
  req: ModalFileValidationRequest,
): Promise<AxiosResponse<ModalFileValidationResponse>> => {
  try {
    const response = await axios.post(`/modal-file-validation`, req);
    return response;
  } catch (error) {
    throw new Error("Error creating modal app");
  }
};

export const useValidateModalFile = () => {
  return useMutation<AxiosResponse<ModalFileValidationResponse>, Error, ModalFileValidationRequest>(
    {
      mutationFn: validateModalFile,
    },
  );
};
