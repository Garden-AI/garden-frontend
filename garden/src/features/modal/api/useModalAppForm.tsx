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
   * @param appId The ID of the deployed app
   */
  onDeploymentSuccess?: (appId: number) => void;
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Reset validation state when a new file is selected
    setIsValidated(false);
    clearErrors();

    // Reset any form-level validation errors
    form.clearErrors();

    // If we had previously validated a file, inform the user
    // that the new file will be validated automatically
    if (modalMetadata) {
      toast.info("New file selected. Validating...");
    }

    // Reset modalMetadata when a new file is selected
    setModalMetadata(null);
    setIsDeploymentComplete(false);
    setDeployedAppId(null);

    setFile(selectedFile);
    setIsValidating(true);
    setValidationError(null);
    setDeploymentError(null);

    try {
      const fileContents = await selectedFile.text();
      form.setValue("file_contents", fileContents);

      // Automatically validate the file after loading
      const metadata = await validateModalFile(fileContents);

      if (metadata) {
        setIsValidated(true);

        // Initialize the modal_functions field with the validated metadata
        const functions = metadata.modal_functions || [];
        form.setValue("modal.modal_functions", functions as any);

        setModalMetadata(metadata);
        toast.success("Modal file validated successfully");
      } else {
        // If validateModalFile returns null but didn't throw an error,
        // check if useModalAppUpload has a validation error
        if (useModalAppUploadValidationError) {
          // Use the actual backend error with its specific message and suggested fix
          setValidationError(useModalAppUploadValidationError);
          toast.error("Validation failed");
        }
      }
    } catch (error) {
      // Don't create a new error object - use what's already in useModalAppUploadValidationError
      // which should have the proper error information from the backend
      if (useModalAppUploadValidationError) {
        setValidationError(useModalAppUploadValidationError);
      } else if (error instanceof ApiError) {
        // If it's an ApiError, it will have the specific error information from the backend
        setValidationError({
          message: error.message,
          suggestedFix: error.suggestedFix,
          isApiError: true
        });
      } else if (error instanceof Error) {
        // For generic errors
        setValidationError({
          message: error.message,
          isApiError: false
        });
      } else {
        // Last resort fallback
        setValidationError({
          message: "Unknown error occurred during validation",
          isApiError: false
        });
      }
      toast.error("Validation failed");
    } finally {
      setIsValidating(false);
    }
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

    setIsValidating(true);
    setValidationError(null);

    try {
      const fileContents = await file.text();
      form.setValue("file_contents", fileContents);

      // Automatically validate the file after loading
      const metadata = await validateModalFile(fileContents);

      if (metadata) {
        setIsValidated(true);

        // Initialize the modal_functions field with the validated metadata
        const functions = metadata.modal_functions || [];
        form.setValue("modal.modal_functions", functions as any);

        setModalMetadata(metadata);
        toast.success("Modal file validated successfully");
      } else {
        // If validateModalFile returns null but didn't throw an error,
        // check if useModalAppUpload has a validation error
        if (useModalAppUploadValidationError) {
          // Use the actual backend error with its specific message and suggested fix
          setValidationError(useModalAppUploadValidationError);
          toast.error("Validation failed");
        }
      }
    } catch (error) {
      // Don't create a new error object - use what's already in useModalAppUploadValidationError
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
        // Fallback for unknown error types
        setValidationError({
          message: "Unknown error occurred during validation",
          isApiError: false
        });
      }
      toast.error("Validation failed");
    } finally {
      setIsValidating(false);
    }
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
      toast.success(`Modal app ${toUpdate ? "updated" : "deployed"} successfully!`);

      // Invalidate the modelDeployments query to ensure fresh data is fetched
      queryClient.invalidateQueries({ queryKey: ["modelDeployments"] });

      if (showSuccessScreen) {
        // Show success screen in the form (don't navigate away immediately)
        setIsDeploymentComplete(true);
      }

      if (onDeploymentSuccess && appId !== undefined) {
        onDeploymentSuccess(appId);
      } else if (toUpdate) {
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
    } catch (error: any) {
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