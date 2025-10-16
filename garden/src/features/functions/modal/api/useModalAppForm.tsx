import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useModalAppUpload } from "./useModalAppUpload";
import { useGlobusAuth } from "@globus/react-auth-context";
import { toast } from "sonner";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ApiError } from "@/features/gardens/utils/garden.utils";
import { ModalFileMetadataResponse } from "@/types";
import { ValidationError, DeploymentError } from "./useModalAppUpload";
import { useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { ModelDeployment } from "@/features/model-deployments/ModelDeployments";

export const modalAppFormSchema = z.object({
  file_contents: z.string().min(1, "Modal file is required"),
  modal: z.object({
    modal_functions: z.array(z.any()).optional(),
  }).optional(),
});

export type ModalAppFormValues = z.infer<typeof modalAppFormSchema>;

export interface UseModalAppFormOptions {
  /**
   * Function called after successful deployment
   * @param deployment The full deployment object
   */
  onDeploymentSuccess?: (deployment: ModelDeployment) => void;
  /**
   * Whether to show a success screen after deployment
   * @default false
   */
  showSuccessScreen?: boolean;

  /**
   * Update an existing modal app, otherwise create a new one
   * @default undefined
   */
  toUpdate?: number;

  /**
   * URL to redirect to after deployment, with ':id' placeholder for app ID
   * Examples: 
   * - "/garden/create?modalAppId=:id" (will create a search param)
   * - "/model-deployments/:id" (will replace :id with the actual ID)
   * @default undefined - if not specified, will default to adding a modalAppId search param
   */
  redirectUrl?: string;
}

/**
 * Hook for managing the Modal app upload form state and submission
 * Handles file reading, form state, and integration with the Modal API
 */
export const useModalAppForm = ({
  onDeploymentSuccess,
  showSuccessScreen = false,
  toUpdate,
  redirectUrl,
}: UseModalAppFormOptions = {}) => {
  const auth = useGlobusAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const uuid = auth?.authorization?.user?.sub;
  const [file, setFile] = useState<File | null>(null);
  const [modalMetadata, setModalMetadata] = useState<ModalFileMetadataResponse | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [isDeploymentComplete, setIsDeploymentComplete] = useState(false);
  const [deployedAppId, setDeployedAppId] = useState<number | null>(null);
  const [validationError, setValidationError] = useState<ValidationError | null>(null);
  const [deploymentError, setDeploymentError] = useState<DeploymentError | null>(null);

  const {
    validateModalFile,
    deployModalApp,
    updateModalApp,
    isValidating: useModalAppUploadIsValidating,
    validationError: useModalAppUploadValidationError,
    deploymentError: useModalAppUploadDeploymentError,
    clearErrors
  } = useModalAppUpload();

  const form = useForm<ModalAppFormValues>({
    resolver: zodResolver(modalAppFormSchema),
    defaultValues: {
      file_contents: "",
      modal: {
        modal_functions: [],
      },
    },
  });

  // Reset the form state
  const resetForm = () => {
    setFile(null);
    setModalMetadata(null);
    setIsValidated(false);
    setIsDeploymentComplete(false);
    setDeployedAppId(null);
    setValidationError(null);
    setDeploymentError(null);
    form.reset();
  };

  // Helper to validate file contents and update state
  const validateAndSetMetadata = async (fileContents: string) => {
    setIsValidating(true);
    setValidationError(null);
    setDeploymentError(null);

    try {
      form.setValue("file_contents", fileContents);
      // Automatically validate the file after loading
      const metadata = await validateModalFile(fileContents);

      if (metadata) {
        setIsValidated(true);
        // Initialize the modal_functions field with the validated metadata
        const functions = metadata.modal_functions || [];
        form.setValue("modal.modal_functions", functions);
        setModalMetadata(metadata);
        toast.success("Modal file validated successfully");
      } else {
        // If validateModalFile returns null but didn't throw an error,
        // check if useModalAppUpload has a validation error
        if (useModalAppUploadValidationError) {
          setValidationError(useModalAppUploadValidationError);
        } else {
          setValidationError({
            message: "File validation failed. Please check your file and try again.",
            isApiError: false
          });
        }
        toast.error("File validation failed");
      }
    } catch (error) {
      if (useModalAppUploadValidationError) {
        setValidationError(useModalAppUploadValidationError);
      } else if (error instanceof ApiError) {
        setValidationError({
          message: error.message,
          suggestedFix: error.suggestedFix,
          isApiError: true
        });
      } else if (error instanceof Error) {
        setValidationError({
          message: error.message,
          isApiError: false
        });
      } else {
        setValidationError({
          message: "Unknown error occurred during validation",
          isApiError: false
        });
      }
      toast.error("File validation failed");
    } finally {
      setIsValidating(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Reset validation state when a new file is selected
    setIsValidated(false);
    clearErrors();
    form.clearErrors();
    if (modalMetadata) {
      toast.info("New file selected. Validating...");
    }
    setModalMetadata(null);
    setIsDeploymentComplete(false);
    setDeployedAppId(null);
    setFile(selectedFile);

    // Validate the new file
    const fileContents = await selectedFile.text();
    await validateAndSetMetadata(fileContents);
  };

  // New handler for updating function metadata
  const handleFunctionMetadataChange = (
    functionIndex: number,
    field: string,
    value: string,
    event?: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    // Handle tab key in text areas to insert spaces
    if (event?.key === 'Tab') {
      event.preventDefault();

      // Default 2-space indentation
      const indentSize = 2;
      const indent = ' '.repeat(indentSize);
      const { selectionStart, selectionEnd } = event.currentTarget;

      // Insert indentation at cursor
      const newValue = value.substring(0, selectionStart) + indent + value.substring(selectionEnd);

      // Update value with indentation
      const path = `modal.modal_functions.${functionIndex}.${field}` as const;
      form.setValue(path, newValue, {
        shouldValidate: true,
        shouldDirty: true
      });

      // Set cursor position after inserted indent
      setTimeout(() => {
        const input = event.currentTarget;
        const newCursorPos = selectionStart + indentSize;
        input.focus();
        input.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);

      return;
    }

    // Regular field update without special handling
    const path = `modal.modal_functions.${functionIndex}.${field}` as const;
    form.setValue(path, value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleValidate = async () => {
    if (!file) return;
    const fileContents = await file.text();
    await validateAndSetMetadata(fileContents);
  };

  const handleSubmit = async (data: ModalAppFormValues) => {
    if (!isValidated || !modalMetadata) {
      toast.error("Please validate your Modal file before deploying");
      return;
    }

    setIsDeploying(true);
    setDeploymentError(null);

    try {
      clearErrors();
      window.scrollTo(0, 0);

      // Update the metadata with any edited function details
      const updatedMetadata = {
        ...modalMetadata,
        modal_functions: data.modal?.modal_functions || modalMetadata.modal_functions,
      };

      let appId: number | undefined;
      if (toUpdate) {
        appId = await updateModalApp(data.file_contents, toUpdate);
      } else {
        appId = await deployModalApp(data.file_contents, updatedMetadata, uuid);
      }

      if (appId === undefined) {
        throw new Error("Failed to deploy Modal app. App ID not returned.");
      }

      setDeployedAppId(appId);
      toast.success(`Modal app ${toUpdate ? "updated" : "deployment started"} successfully!`);

      // Cache invalidation already handled in useModalAppUpload when deployment starts
      // Fetch the full deployment object and pass it to the callback
      if (onDeploymentSuccess && appId !== undefined) {
        try {
          // Fetch the full deployment object from the API
          const modalAppResponse = await axios.get(`/modal-apps/${appId}`);
          const deployment: ModelDeployment = {
            id: modalAppResponse.data.id ?? -1,
            name: modalAppResponse.data.original_app_name || modalAppResponse.data.app_name,
            status: modalAppResponse.data.deploy_status === "done" ? "deployed" :
              modalAppResponse.data.deploy_status === "error" ? "error" :
              modalAppResponse.data.deploy_status === "timed_out" ? "error" :
              modalAppResponse.data.deploy_status === "pending" ? "undeployed" : "undeployed",
            type: "Modal App",
            originalData: modalAppResponse.data,
          };
          
          // Call the callback with the full deployment object
          onDeploymentSuccess(deployment);
        } catch (error) {
          console.error("Failed to fetch deployment object:", error);
          // Fallback: still show success but without selection
        }
      }

      if (showSuccessScreen) {
        // Show success screen in the form (don't navigate away immediately)
        setIsDeploymentComplete(true);
      }

      if (toUpdate) {
        console.log("UPDATED!!");
      } else {
        // Handle redirection based on redirectUrl or default behavior
        if (redirectUrl) {
          // Replace :id placeholder with actual app ID
          const finalUrl = redirectUrl.replace(':id', appId.toString());

          // Check if we're using search params or path params
          if (finalUrl.includes('?')) {
            // Parse the URL to extract search params
            const [path, searchParamsString] = finalUrl.split('?');
            const urlSearchParams = new URLSearchParams(searchParamsString);

            // Set search params and navigate to the path
            setSearchParams(urlSearchParams);

            // If we're changing the URL path (not just search params), navigate
            if (path !== window.location.pathname) {
              navigate(path);
            }
          } else {
            // Direct navigation to the URL with the ID inserted
            navigate(finalUrl);
          }
        } else {
          // Default behavior - update search params with modalAppId
          setSearchParams({ modalAppId: appId.toString() });
        }
      }
    } catch (error: unknown) {
      // Get the properly formatted error from useModalAppUpload
      if (useModalAppUploadDeploymentError) {
        setDeploymentError(useModalAppUploadDeploymentError);
      } else if (error instanceof ApiError) {
        setDeploymentError({
          message: error.message,
          suggestedFix: error.suggestedFix,
          deploymentOutput: error.deploymentOutput,
          isTimeout: false,
          isApiError: true
        });
      } else if (error instanceof Error) {
        setDeploymentError({
          message: error.message,
          isTimeout: false,
          isApiError: false
        });
      } else {
        // Fallback for unknown error types
        setDeploymentError({
          message: "Failed to deploy Modal app. Please try again.",
          isTimeout: false,
          isApiError: false
        });
      }
    } finally {
      setIsDeploying(false);
    }
  };

  return {
    form,
    file,
    handleFileChange,
    handleFunctionMetadataChange,
    handleValidate,
    handleSubmit: form.handleSubmit(handleSubmit),
    resetForm,
    modalMetadata,
    isValidating,
    isDeploying,
    isValidated,
    isDeploymentComplete,
    deployedAppId,
    validationError,
    deploymentError
  };
}; 