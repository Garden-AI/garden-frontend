import { useForm, useFormContext } from "react-hook-form";
import { useBlocker, useNavigate } from "react-router-dom";
import { useGlobusAuth } from "@globus/react-auth-context";
import { gardenFormSchema, GardenCreateFormData } from "../../types/garden.types";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/shadcn/form";
import LoadingSpinner from "@/components/LoadingSpinner";
import { UnsavedChangesDialog } from "@/components/UnsavedChangesDialog";
import { CreateGardenFormFields } from "./CreateGardenFormFields";
import { useCreateGardenAndDOI } from "../../api/useCreateGardenAndDOI";
import { GardenCreateRequest } from "@/types";
import { ApiError } from "../../utils/garden.utils";
import { AxiosError } from "axios";
import { useModalAppMetadata } from "../../../modal/api/useModalAppMetadata";
import { OverallProgress } from "@/components/progress/OverallProgress";

/**
 * Component for creating a new garden
 * Can be used in two contexts:
 * 1. As a standalone garden creation without requiring a modal app upload (default)
 * 2. With a pre-deployed modal app (modalAppId provided and hasModalApp=true)
 */
interface CreateGardenFormProps {
  modalAppId?: string | null;
  /** 
   * When true, allows the user to upload a modal app file. 
   * When false (default), the modal app upload fields are hidden.
   */
  hasModalApp?: boolean;
}

export const CreateGardenForm = ({ modalAppId, hasModalApp = false }: CreateGardenFormProps) => {
  const navigate = useNavigate();
  const auth = useGlobusAuth();
  const uuid = auth?.authorization?.user?.sub;

  const { createGardenAndDOI } = useCreateGardenAndDOI();

  const form = useForm<GardenCreateFormData>({
    resolver: zodResolver(gardenFormSchema),
    mode: "onTouched",
    defaultValues: {
      title: "",
      description: "",
      authors: [],
      contributors: [],
      entrypoint_ids: [],
      doi: "", // Will be generated
      doi_is_draft: true,
      is_test: true,
      year: "2024",
      language: "en",
      tags: [],
      version: "1.0.0",
      owner_identity_id: uuid || "",
      publisher: "Garden-AI",
      is_archived: false,
      modal: {
        app_name: "",
        file_contents: "",
        modal_functions: [],
      },
    },
  });

  // Use the modal app metadata hook to pre-populate the form when modalAppId is provided
  const { modalApp } = useModalAppMetadata(modalAppId, form, "modal");

  const blocker = useBlocker(
    () => !form?.formState.isSubmitting && Object.keys(form.formState.touchedFields).length > 0,
  );

  const onSubmit = async (values: GardenCreateFormData) => {
    try {
      let gardenCreateRequest: GardenCreateRequest = {
        ...values,
        doi_is_draft: true,
        is_archived: false,
        publisher: "Garden-AI",
        owner_identity_id: uuid || "",
        language: values.language || "en",
      };

      if (modalAppId && modalApp) {
        // Use the pre-deployed modal app, but preserve user selections for additional functions
        gardenCreateRequest.modal_function_ids = [
          ...(modalApp.modal_function_ids || []),
          ...(values.modal_function_ids || [])
        ];
        
        // Remove duplicates if any
        gardenCreateRequest.modal_function_ids = [...new Set(gardenCreateRequest.modal_function_ids)];
      }

      const { garden } = await createGardenAndDOI(gardenCreateRequest);

      toast.success("Garden created successfully!");
      navigate(`/garden/${encodeURIComponent(garden.doi)}?newlyCreated=true`);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const apiError = ApiError.fromAxiosError(error);
        const errorMessage = apiError.message;
        const suggestedFix = apiError.suggestedFix;
        
        if (suggestedFix) {
          toast.error(<div>
            <p>{errorMessage}</p>
            <p className="mt-2 text-sm font-medium">Suggested Fix: {suggestedFix}</p>
          </div>, { duration: 7000 });
        } else {
          toast.error(errorMessage);
        }
      } else if (error instanceof ApiError) {
        const errorMessage = error.message;
        const suggestedFix = error.suggestedFix;
        
        if (suggestedFix) {
          toast.error(<div>
            <p>{errorMessage}</p>
            <p className="mt-2 text-sm font-medium">Suggested Fix: {suggestedFix}</p>
          </div>, { duration: 7000 });
        } else {
          toast.error(errorMessage);
        }
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred. Please check the form and try again.");
      }
      
      console.error(error);
    }
  };

  return (
    <>
      {modalAppId && <OverallProgress currentPhase={2} isSubmitting={form.formState.isSubmitting} />}
      
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-bold">Create Garden</h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CreateGardenFormFields 
              hideModalUpload={!!modalAppId} 
              hasModalApp={hasModalApp}
            />
            <LoadingOverlay />
            <UnsavedChangesDialog blocker={blocker} />
          </form>
        </Form>
      </div>
    </>
  );
};

const LoadingOverlay = () => {
  const form = useFormContext();
  const { isSubmitting } = form.formState;

  return (
    isSubmitting && (
      <div className="no-doc-scroll fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-black/70">
        <LoadingSpinner />
      </div>
    )
  );
};
