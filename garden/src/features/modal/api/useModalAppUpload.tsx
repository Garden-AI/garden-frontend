import { useState } from "react";
import { useValidateModalFile } from "../../gardens/api/useValidateModalFile";
import { useCreateModalApp, DeployTimeoutError, createOrUpdateModalApp } from "../../modal/api/useCreateModalApp";
import { ModalAppPatchRequest, ModalFileMetadataResponse } from "@/types";
import { ApiError } from "../../gardens/utils/garden.utils";
import { AxiosError } from "axios";
import instance from "@/lib/axios";

export interface ValidationError {
  message: string;
  suggestedFix?: string;
  isApiError: boolean;
}

export interface DeploymentError {
  message: string;
  suggestedFix?: string;
  isTimeout: boolean;
  isApiError: boolean;
}

// Extended type that includes id field returned from the API
interface ExtendedModalFileMetadata extends ModalFileMetadataResponse {
  id?: number;
}

export interface UseModalAppUploadReturn {
  validateModalFile: (fileContents: string) => Promise<ModalFileMetadataResponse | null>;
  deployModalApp: (fileContents: string, modalMetadata: ModalFileMetadataResponse, ownerIdentityId?: string) => Promise<number | undefined>;
  updateModalApp: (fileContents: string, appId: number) => Promise<number | undefined>;
  modalMetadata: ExtendedModalFileMetadata | null;
  isValidating: boolean;
  isDeploying: boolean;
  validationError: ValidationError | null;
  deploymentError: DeploymentError | null;
  clearErrors: () => void;
}

/**
 * Hook for handling the validation and deployment of a Modal App
 * Separates the API logic from the component rendering
 */
export const useModalAppUpload = (): UseModalAppUploadReturn => {
  const [modalMetadata, setModalMetadata] = useState<ExtendedModalFileMetadata | null>(null);
  const [validationError, setValidationError] = useState<ValidationError | null>(null);
  const [deploymentError, setDeploymentError] = useState<DeploymentError | null>(null);

  const { mutateAsync: validateFile, isPending: isValidating } = useValidateModalFile();
  const { mutateAsync: createOrUpdateApp, isPending: isDeploying } = useCreateModalApp();

  const clearErrors = () => {
    setValidationError(null);
    setDeploymentError(null);
  };

  const handleDeploymentError = async (error: any): Promise<never> => {
    const isTimeout = error instanceof DeployTimeoutError;
    let errorMessage = "Failed to deploy Modal app";
    let suggestedFix: string | undefined = undefined;
    let isApiError = false;

    if (error instanceof ApiError) {
      errorMessage = error.message;
      suggestedFix = error.suggestedFix;
      isApiError = true;
    } else if (error instanceof AxiosError) {
      const apiError = ApiError.fromAxiosError(error);
      errorMessage = apiError.message;
      suggestedFix = apiError.suggestedFix;
      isApiError = true;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String(error.message);
    }

    setDeploymentError({
      message: errorMessage,
      suggestedFix,
      isTimeout,
      isApiError
    });

    throw error;
  };

  const validateModalFile = async (fileContents: string): Promise<ModalFileMetadataResponse | null> => {
    setValidationError(null);

    try {
      const metadata = await validateFile({ file_contents: fileContents });
      setModalMetadata(metadata);
      return metadata;
    } catch (error) {
      let errorMessage = "Unknown validation error";
      let suggestedFix: string | undefined = undefined;
      let isApiError = false;

      if (error instanceof ApiError) {
        errorMessage = error.message;
        suggestedFix = error.suggestedFix;
        isApiError = true;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setValidationError({
        message: errorMessage,
        suggestedFix,
        isApiError
      });

      return null;
    }
  };

  const deployModalApp = async (fileContents: string, metadata: ModalFileMetadataResponse, ownerIdentityId?: string): Promise<number | undefined> => {
    setDeploymentError(null);

    try {
      // Ensure modal_functions are included with any user edits
      const appRequest = {
        file_contents: fileContents,
        app_name: metadata.app_name,
        modal_functions: metadata.modal_functions || [],
        requirements: metadata.requirements || [],
        conda_requirements: metadata.conda_requirements || [],
        base_image_name: metadata.base_image_name,
        owner_identity_id: ownerIdentityId,
      };

      const response = await createOrUpdateApp(appRequest);

      // Update the stored metadata with the latest version
      if (modalMetadata) {
        setModalMetadata({
          ...modalMetadata,
          ...metadata,
          id: response.data.id,
        });
      }

      return response.data.id;
    } catch (error) {
      await handleDeploymentError(error);
      return undefined;
    }
  };

  const updateModalApp = async (fileContents: string, appId: number): Promise<number | undefined> => {
    setDeploymentError(null);

    try {
      const updateRequest: ModalAppPatchRequest = {
        file_contents: fileContents,
      };

      const response = await createOrUpdateModalApp(updateRequest, appId);
      return response.data.id;
    } catch (error) {
      await handleDeploymentError(error);
      return undefined;
    }
  };

  return {
    validateModalFile,
    deployModalApp,
    updateModalApp,
    modalMetadata,
    isValidating,
    isDeploying,
    validationError,
    deploymentError,
    clearErrors
  };
}; 