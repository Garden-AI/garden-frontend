import instance from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse, AxiosError } from "axios";
import { ModalAppCreateRequest, ModalAppMetadataResponse, ModalAppPatchRequest } from "@/types";
import { ApiError } from "../../gardens/utils/garden.utils";

export const useCreateModalApp = () => {
  return useMutation<AxiosResponse<ModalAppMetadataResponse>, Error, ModalAppCreateRequest | ModalAppPatchRequest>({
    mutationFn: createOrUpdateModalApp,
  });
};

export class DeployTimeoutError extends Error {
  constructor() {
    const timeoutMsg = `This Garden is taking a long time to deploy. 
          If your Modal App downloads large files or installs large libraries, this may be expected.
          The installation is still happening in the background. 
          Leave the form as it is, wait a few minutes, and try submitting again.`
    super(timeoutMsg);
    this.name = "DeployTimeoutError";
  }
}

export const createOrUpdateModalApp = async (
  req: ModalAppCreateRequest | ModalAppPatchRequest,
  update: number = 0,
): Promise<AxiosResponse<ModalAppMetadataResponse>> => {
  try {
    // Make the initial request
    const response = update ?
      await instance.patch(`/modal-apps/async/${update}`, req) :
      await instance.post(`/modal-apps/async`, req);

    // Extract the job id from the response
    const appId = response.data.id

    // Set a timeout that is slightly shorter than the backend Lambda timeout
    // 4 minutes + 55 seconds
    const timeoutDuration = (4 * 60 * 1000) + (55 * 1000);
    const startTime = Date.now();

    // Poll the job status
    while (true) {
      // Check if we've exceeded the timeout
      if (Date.now() - startTime > timeoutDuration) {
        throw new DeployTimeoutError();
      }

      const pollResponse = await instance.get(`/modal-apps/${appId}`);
      if (pollResponse.data.deploy_status === "error") {
        throw new ApiError(
          pollResponse.data.deploy_error,
          pollResponse.data.suggested_fix,
          pollResponse.data.deployment_output
        );
      }
      if (pollResponse.data.deploy_status === "done") {
        return pollResponse;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw ApiError.fromAxiosError(error);
    } else {
      console.error(`Error not from Axios: ${error}`)
      throw error;
    }
  }
};
