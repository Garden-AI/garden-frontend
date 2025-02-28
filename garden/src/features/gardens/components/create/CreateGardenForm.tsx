import { useForm, useFormContext } from "react-hook-form";
import { useBlocker, useNavigate, useSearchParams } from "react-router-dom";
import { useGlobusAuth } from "@/hooks/useGlobusAuth";
import { gardenFormSchema, GardenCreateFormData } from "../../types/garden.types";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import LoadingSpinner from "@/components/LoadingSpinner";
import { UnsavedChangesDialog } from "@/components/UnsavedChangesDialog";
import { CreateGardenFormFields } from "./CreateGardenFormFields";
import { useCreateGardenAndDOI } from "../../api/useCreateGardenAndDOI";
import { GardenCreateRequest } from "@/types";
import { ApiError } from "../../utils/garden.utils";
import { AxiosError } from "axios";
import { useModalAppMetadata } from "../../api/useModalAppMetadata";
import { cn } from "@/utils/form.utils";
import { CheckCircle2 } from "lucide-react";

// Interface for the overall progress indicator
interface OverallProgressProps {
  currentPhase: number;
}

// Overall progress component to show the main phases of garden creation
const OverallProgress = ({ currentPhase }: OverallProgressProps) => {
  const phases = [
    { number: 1, label: "Upload Modal App" },
    { number: 2, label: "Configure Garden" }
  ];

  return (
    <div className="mb-6">
      <div className="mb-2">
        <h3 className="text-sm font-medium text-gray-500">Publishing Progress</h3>
      </div>
      <div className="relative">
        {/* Progress Bar Background */}
        <div className="absolute left-0 top-4 h-1 w-full rounded-full bg-gray-200"></div>
        
        {/* Progress Bar Fill */}
        <div 
          className="absolute left-0 top-4 h-1 rounded-full bg-primary transition-all duration-300 ease-in-out"
          style={{ width: `${(currentPhase - 1) / (phases.length - 1) * 100}%` }}
        ></div>
        
        {/* Phases */}
        <div className="relative flex justify-between">
          {phases.map((phase) => (
            <div 
              key={phase.number} 
              className="flex flex-col items-center"
            >
              <div 
                className={cn(
                  "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors duration-300",
                  currentPhase >= phase.number 
                    ? "border-primary bg-primary text-white"
                    : "border-gray-300 bg-white text-gray-400"
                )}
              >
                {currentPhase > phase.number ? (
                  <CheckCircle2 className="h-7 w-7" />
                ) : (
                  <span className="text-base font-semibold">{phase.number}</span>
                )}
              </div>
              <span 
                className={cn(
                  "mt-2 text-sm font-medium",
                  currentPhase >= phase.number ? "text-gray-900" : "text-gray-500"
                )}
              >
                {phase.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Component for creating a new garden
 * Handles both entrypoint-based gardens and modal-based gardens
 * For modal-based gardens, can use a pre-deployed modal app
 */
interface CreateGardenFormProps {
  modalAppId?: string | null;
}

export const CreateGardenForm = ({ modalAppId }: CreateGardenFormProps = {}) => {
  const navigate = useNavigate();
  const auth = useGlobusAuth();
  const uuid = auth?.authorization?.user?.sub;

  const [searchParams] = useSearchParams();
  const formType = searchParams.get("type");
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

  // Use the modal app metadata hook to pre-populate the form
  const { modalApp } = useModalAppMetadata(modalAppId, form, formType);

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
        // Use the pre-deployed modal app
        gardenCreateRequest.modal_function_ids = modalApp.modal_function_ids;
      }

      const { garden } = await createGardenAndDOI(gardenCreateRequest);

      toast.success("Garden created successfully!");
      navigate(`/garden/${encodeURIComponent(garden.doi)}`);
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
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-bold">Create Garden</h2>
      
      {/* Overall Progress - Phase 2 */}
      <OverallProgress currentPhase={2} />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CreateGardenFormFields hideModalUpload={!!modalAppId} />
          <LoadingOverlay />
          <UnsavedChangesDialog blocker={blocker} />
        </form>
      </Form>
    </div>
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
