import axios from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
// import {ModalFileValidationRequest, ModalFileValidationResponse} from "@/api/types";

interface ModalFileValidationRequest {
  file: File;
}

// TODO: Ensure response and request types match the actual API, this is just a placeholder
// Also eventually run npm run refresh-types to update the types and import those instead (uncomment above line)

interface ModalFileValidationResponse {
  is_valid: boolean;
  pip_requirements: string[];
  base_image_requirements: string[];
  app_name: string;
  functions: {
    name: string;
    function_text: string;
  }[];
}

const validateModalFile = async (
  req: ModalFileValidationRequest,
): Promise<ModalFileValidationResponse> => {
  // TODO: Implement this function
  // For now just mock the response

  return {
    is_valid: true,
    app_name: "Modal App name",
    functions: [
      {
        name: "function1",
        function_text: "def function1():\n    return 1",
      },
      {
        name: "function2",
        function_text: "def function2():\n    return 2",
      },
      {
        name: "function3",
        function_text: "def function3():\n    return 3",
      },
    ],
    pip_requirements: ["numpy", "pandas"],
    base_image_requirements: ["python:3.8"],
  };
  // try {
  //   const response = await axios.post(`/modal-file-validation`, req);
  //   return response.data;
  // } catch (error) {
  //   throw new Error("Error creating modal app");
  // }
};

export const useValidateModalFile = () => {
  return useMutation<ModalFileValidationResponse, Error, ModalFileValidationRequest>({
    mutationFn: validateModalFile,
  });
};
