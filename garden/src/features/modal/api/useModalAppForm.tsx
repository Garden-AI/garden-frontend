import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useModalAppUpload } from "./useModalAppUpload";
import { useGlobusAuth } from "@/hooks/useGlobusAuth";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import { ApiError } from "../../gardens/utils/garden.utils";

export const modalAppFormSchema = z.object({
  file_contents: z.string().min(1, "Modal file is required"),
  modal: z.object({
    modal_functions: z.array(z.any()).optional(),
  }).optional(),
});

export type ModalAppFormValues = z.infer<typeof modalAppFormSchema>;

/**
 * Hook for managing the Modal app upload form state and submission
 * Handles file reading, form state, and integration with the Modal API
 */
export const useModalAppForm = () => {
  const auth = useGlobusAuth();
  const uuid = auth?.authorization?.user?.sub;
  const [, setSearchParams] = useSearchParams();
  const [file, setFile] = useState<File | null>(null);
  const [isValidated, setIsValidated] = useState(false);

  const {
    validateModalFile,
    deployModalApp,
    modalMetadata,
    isValidating,
    isDeploying,
    validationError,
    deploymentError,
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
    
    setFile(selectedFile);
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      const contents = event.target?.result as string;
      form.setValue("file_contents", contents);
      
      // Automatically validate the file after loading
      try {
        // Slight delay to ensure UI updates for better user feedback
        setTimeout(async () => {
          const metadata = await validateModalFile(contents);
          
          if (metadata) {
            setIsValidated(true);
            
            // Initialize the modal_functions field with the validated metadata
            const functions = metadata.modal_functions || [];
            form.setValue("modal.modal_functions", functions as any);
            
            toast.success("Modal file validated successfully");
          }
        }, 100);
      } catch (error) {
        // Error handling is done in the useModalAppUpload hook
        setIsValidated(false);
      }
    };
    
    reader.readAsText(selectedFile);
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
    try {
      // Clear previous errors
      clearErrors();
      form.clearErrors();
      
      // Reset validation state at the beginning of validation
      setIsValidated(false);
      
      const contents = form.getValues("file_contents");
      const metadata = await validateModalFile(contents);
      
      if (metadata) {
        setIsValidated(true);
        
        // Initialize the modal_functions field with the validated metadata
        const functions = metadata.modal_functions || [];
        form.setValue("modal.modal_functions", functions as any);
        
        toast.success("Modal file validated successfully");
      }
    } catch (error) {
      // Error display is handled by the hook
      // No need to show toast here as the error will be displayed in the UI
      setIsValidated(false);
    }
  };

  const handleSubmit = async (data: ModalAppFormValues) => {
    if (!isValidated || !modalMetadata) {
      toast.error("Please validate your Modal file before deploying");
      return;
    }

    try {
      clearErrors();
      
      // Update the metadata with any edited function details
      const updatedMetadata = {
        ...modalMetadata,
        modal_functions: data.modal?.modal_functions || modalMetadata.modal_functions,
      };
      
      const appId = await deployModalApp(data.file_contents, updatedMetadata, uuid);
      toast.success("Modal app deployed successfully!");
      
      // Navigate to the garden creation form with the modal app ID
      setSearchParams({ type: "modal", step: "create", modalAppId: appId.toString() });
    } catch (error: any) {
      // Error handling is now done in the useModalAppUpload hook
      // No need to add additional toast messages here
    }
  };

  return {
    form,
    file,
    handleFileChange,
    handleFunctionMetadataChange,
    handleValidate,
    handleSubmit: form.handleSubmit(handleSubmit),
    modalMetadata,
    isValidating,
    isDeploying,
    isValidated,
    validationError,
    deploymentError
  };
}; 