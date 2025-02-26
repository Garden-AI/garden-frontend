import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useModalAppUpload } from "./useModalAppUpload";
import { useGlobusAuth } from "@/hooks/useGlobusAuth";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

export const modalAppFormSchema = z.object({
  file_contents: z.string().min(1, "Modal file is required"),
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
    deploymentError
  } = useModalAppUpload();

  const form = useForm<ModalAppFormValues>({
    resolver: zodResolver(modalAppFormSchema),
    defaultValues: {
      file_contents: "",
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      const contents = event.target?.result as string;
      form.setValue("file_contents", contents);
      
      try {
        const metadata = await validateModalFile(contents);
        if (metadata) {
          setIsValidated(true);
          toast.success("Modal file validated successfully");
        }
      } catch (error) {
        toast.error("Invalid modal file. Please check and try again.");
        form.setError("file_contents", { message: "Invalid modal file format" });
      }
    };
    
    reader.readAsText(selectedFile);
  };

  const handleSubmit = async (data: ModalAppFormValues) => {
    if (!isValidated || !modalMetadata) {
      toast.error("Please upload and validate a modal file first");
      return;
    }

    try {
      const appId = await deployModalApp(data.file_contents, modalMetadata, uuid);
      toast.success("Modal app deployed successfully!");
      
      // Navigate to the garden creation form with the modal app ID
      setSearchParams({ type: "modal", step: "create", modalAppId: appId.toString() });
    } catch (error: any) {
      if (error.name === "DeployTimeoutError") {
        toast.error(error.message);
      } else {
        toast.error("Failed to deploy modal app. Please check your file and try again.");
      }
    }
  };

  return {
    form,
    file,
    handleFileChange,
    handleSubmit: form.handleSubmit(handleSubmit),
    modalMetadata,
    isValidating,
    isDeploying,
    isValidated,
    validationError,
    deploymentError
  };
}; 