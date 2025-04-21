import { ModalAppCreateRequest, ModalAppMetadataResponse } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import { createOrUpdateModalApp } from "./useCreateModalApp";

export const useUpdateModalApp = () => {
  return useMutation<AxiosResponse<ModalAppMetadataResponse>, Error, ModalAppCreateRequest>({
    mutationFn: createOrUpdateModalApp,
  });
}