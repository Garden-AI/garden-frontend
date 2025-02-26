import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { GardenCreateFormData } from "../types/garden.types";

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
      
      // Pre-populate garden fields with app info when possible
      if (modalApp.modal_functions?.[0]) {
        const firstFunction = modalApp.modal_functions[0];
        // Use the function's title as the garden title if available
        form.setValue("title", firstFunction.title || "");
        form.setValue("description", firstFunction.description || "");
        form.setValue("authors", firstFunction.authors || []);
        form.setValue("tags", firstFunction.tags || []);
        form.setValue("year", firstFunction.year || new Date().getFullYear().toString());
      }
    }
  }, [modalApp, formType, form]);

  return {
    modalApp,
    isLoading
  };
}; 