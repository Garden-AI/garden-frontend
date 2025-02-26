import { useState } from "react";
import { useValidateModalFile } from "../../gardens/api/useValidateModalFile";
import { useCreateModalApp } from "../../gardens/api/useCreateModalApp";
import { ModalFileMetadataResponse } from "@/types";

export interface UseModalAppUploadReturn {
  validateModalFile: (fileContents: string) => Promise<ModalFileMetadataResponse | null>;
  deployModalApp: (fileContents: string, modalMetadata: ModalFileMetadataResponse, ownerIdentityId?: string) => Promise<number>;
  modalMetadata: ModalFileMetadataResponse | null;
  isValidating: boolean;
  isDeploying: boolean;
  validationError: string | null;
  deploymentError: string | null;
}

/**
 * Hook for handling the validation and deployment of a Modal App
 * Separates the API logic from the component rendering
 */
export const useModalAppUpload = (): UseModalAppUploadReturn => {
  const [modalMetadata, setModalMetadata] = useState<ModalFileMetadataResponse | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [deploymentError, setDeploymentError] = useState<string | null>(null);
  
  const { mutateAsync: validateFile, isPending: isValidating } = useValidateModalFile();
  const { mutateAsync: createApp, isPending: isDeploying } = useCreateModalApp();

  const validateModalFile = async (fileContents: string): Promise<ModalFileMetadataResponse | null> => {
    setValidationError(null);
    
    try {
      const metadata = await validateFile({ file_contents: fileContents });
      setModalMetadata(metadata);
      return metadata;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown validation error";
      setValidationError(errorMessage);
      return null;
    }
  };

  const deployModalApp = async (fileContents: string, metadata: ModalFileMetadataResponse, ownerIdentityId?: string): Promise<number> => {
    setDeploymentError(null);
    
    try {
      const response = await createApp({
        file_contents: fileContents,
        app_name: metadata.app_name,
        modal_functions: metadata.modal_functions || [],
        requirements: metadata.requirements || [],
        conda_requirements: metadata.conda_requirements || [],
        base_image_name: metadata.base_image_name,
        owner_identity_id: ownerIdentityId,
      });
      
      return response.data.id;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown deployment error";
      setDeploymentError(errorMessage);
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
    deploymentError
  };
}; 