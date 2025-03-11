import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { GardenCreateFormData } from "../types/garden.types";
import { useGlobusAuth } from "@globus/react-auth-context";
import { useGetUserInfo } from "@/features/users/api/useGetUserInfo";

/**
 * Generate a description for a modal app based on its metadata
 * @param appName - The name of the app
 * @param originalAppName - The original app name if available
 * @param functionNames - Array of function names in the app
 * @returns A generated description in Markdown format
 */
const generateDescription = (
  appName: string, 
  originalAppName: string = '', 
  functionNames: string[] = []
) => {
  // Use original app name if available, otherwise clean up the app name
  const displayName = originalAppName || appName.replace(/_/g, ' ').replace(/-/g, ' ');
  
  let description = `This Garden includes ${displayName}`;
  
  if (functionNames.length > 0) {
    if (functionNames.length === 1) {
      description += ` with the following function:\n\n`;
    } else {
      description += ` with the following functions:\n\n`;
    }
    
    // Add functions as a bulleted list
    functionNames.forEach(func => {
      description += `- \`${func}\`\n`;
    });
    
    description += '\n';
  } else {
    description += '.\n\n';
  }
  
  return description;
};

/**
 * Hook to fetch modal app metadata and pre-populate the garden form
 * This hook acts as a bridge between the Modal and Gardens features
 * 
 * @param modalAppId - The ID of the modal app to fetch
 * @param form - The react-hook-form instance to populate
 * @param formType - The type of form being used (modal or entrypoint)
 * @returns The modal app data and loading state
 */
export const useModalAppMetadata = (
  modalAppId: string | null | undefined,
  form: UseFormReturn<GardenCreateFormData>,
  formType: string | null
) => {
  const auth = useGlobusAuth();
  const { data: userInfo } = useGetUserInfo();
  
  // Use user's full name if available, fallback to email
  const userName = userInfo?.name || auth.authorization?.user?.email;

  // Fetch the modal app data if an ID is provided
  const { data: modalApp, isLoading } = useQuery({
    queryKey: ["modalApp", modalAppId],
    queryFn: () => 
      axios.get(`/modal-apps/${modalAppId}`).then(res => res.data),
    enabled: !!modalAppId,
  });

  // Pre-populate form with modal app data when available
  useEffect(() => {
    if (modalApp && formType === "modal") {
      // Update modal app data
      form.setValue("modal", {
        file_contents: modalApp.file_contents,
        app_name: modalApp.app_name,
        modal_functions: modalApp.modal_functions,
        base_image_name: modalApp.base_image_name,
      });
      
      // Use the original app name from backend if available, otherwise fallback to generated app_name
      form.setValue("title", modalApp.original_app_name || modalApp.app_name || "");
      
      // Generate and set description based on app metadata
      const functionNames = modalApp.modal_functions?.map((f: { function_name: string }) => f.function_name) || [];
      const generatedDescription = generateDescription(
        modalApp.app_name, 
        modalApp.original_app_name, 
        functionNames
      );
      form.setValue("description", generatedDescription);
      
      // Pre-populate authors with logged-in user's name
      if (userName) {
        form.setValue("authors", [userName]);
      }
      
      // Year is still useful to pre-populate
      form.setValue("year", new Date().getFullYear().toString());
      
      // Set a single default tag
      form.setValue("tags", ["Machine Learning"]);
    }
  }, [modalApp, formType, form, userName]);

  return {
    modalApp,
    isLoading
  };
}; 