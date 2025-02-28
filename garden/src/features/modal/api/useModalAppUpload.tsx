import { useState } from "react";
import { useValidateModalFile } from "../../gardens/api/useValidateModalFile";
import { useCreateModalApp, DeployTimeoutError } from "../../gardens/api/useCreateModalApp";
import { ModalFileMetadataResponse } from "@/types";
import { ApiError } from "../../gardens/utils/garden.utils";
import { AxiosError } from "axios";

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

export interface UseModalAppUploadReturn {
  validateModalFile: (fileContents: string) => Promise<ModalFileMetadataResponse | null>;
  deployModalApp: (fileContents: string, modalMetadata: ModalFileMetadataResponse, ownerIdentityId?: string) => Promise<number>;
  modalMetadata: ModalFileMetadataResponse | null;
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
  const [modalMetadata, setModalMetadata] = useState<ModalFileMetadataResponse | null>(null);
  const [validationError, setValidationError] = useState<ValidationError | null>(null);
  const [deploymentError, setDeploymentError] = useState<DeploymentError | null>(null);
  
  const { mutateAsync: validateFile, isPending: isValidating } = useValidateModalFile();
  const { mutateAsync: createApp, isPending: isDeploying } = useCreateModalApp();

  const clearErrors = () => {
    setValidationError(null);
    setDeploymentError(null);
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

  const deployModalApp = async (fileContents: string, metadata: ModalFileMetadataResponse, ownerIdentityId?: string): Promise<number> => {
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
      
      const response = await createApp(appRequest);
      
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
      }
      
      setDeploymentError({
        message: errorMessage,
        suggestedFix,
        isTimeout,
        isApiError
      });
      
      throw error;
    }
  };

  return {
    validateModalFile,
    deployModalApp,
    modalMetadata,
    isValidating,
    isDeploying,
    validationError,
    deploymentError,
    clearErrors
  };
}; 