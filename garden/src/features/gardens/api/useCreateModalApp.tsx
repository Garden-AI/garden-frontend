import axios from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { ModalAppCreateRequest, ModalAppMetadataResponse } from "@/types";

export const useCreateModalApp = () => {
  return useMutation<AxiosResponse<ModalAppMetadataResponse>, Error, ModalAppCreateRequest>({
    mutationFn: createModalApp,
  });
};

const createModalApp = async (
  req: ModalAppCreateRequest,
): Promise<AxiosResponse<ModalAppMetadataResponse>> => {
  try {
    // Make the initial request
    const response = await axios.post(`/modal-apps/async`, req);
    // Extract the job id from the response
    // const status = response.data.deploy_status
    const appId = response.data.id
    // Poll the job status
    while (true) {
      const pollResponse = await axios.get(`/modal-apps/${appId}`);
      if (pollResponse.data.deploy_status === "error") {
        throw new Error(pollResponse.data.deploy_error);
      }
      if (pollResponse.data.deploy_status === "done") {
        return pollResponse;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // TODO: Add a ... 2 minute? ... timeout
    }

    return response;
  } catch (error) {
    throw new Error("Error creating modal app");
  }
};