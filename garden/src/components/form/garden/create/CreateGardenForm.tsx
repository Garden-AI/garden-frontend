import { useForm, useFormContext } from "react-hook-form";
import { useBlocker, useNavigate, useSearchParams } from "react-router-dom";
import { useCreateGardenAndDOI } from "@/api";
import { useGlobusAuth } from "@/components/auth/useGlobusAuth";
import { gardenFormSchema, GardenCreateFormData } from "./schemas";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import LoadingSpinner from "@/components/LoadingSpinner";
import { UnsavedChangesDialog } from "../../UnsavedChangesDialog";
import { CreateGardenFormFields } from "./CreateGardenFormFields";
import { useCreateModalApp } from "@/api/modal/useCreateModalApp";
import { GardenCreateRequest } from "@/api/types";

export const CreateGardenForm = () => {
  const navigate = useNavigate();
  const auth = useGlobusAuth();

  const [searchParams, setSearchParams] = useSearchParams();
  const { createGardenAndDOI } = useCreateGardenAndDOI();
  const { mutateAsync: createModalApp } = useCreateModalApp();

  const form = useForm<GardenCreateFormData>({
    resolver: zodResolver(gardenFormSchema),
    mode: "onTouched",
    defaultValues: {
      title: "",
      authors: [],
      contributors: [],
      entrypoint_ids: [],
      doi_is_draft: true,
      description: "",
      year: "2024",
      language: "en",
      tags: [],
      version: "1.0.0",
      owner_identity_id: auth?.authorization?.user?.sub,
      doi: "",
      publisher: "Gardens-AI",
      is_archived: false,
      modal: {
        app_name: "",
        file_contents: "",
        modal_functions: [],
      },
    },
  });

  const blocker = useBlocker(
    () => !form?.formState.isSubmitting && Object.keys(form.formState.touchedFields).length > 0,
  );

  const onSubmit = async (values: GardenCreateFormData) => {
    try {
      let gardenCreateRequest: GardenCreateRequest = values;
      const formType = searchParams.get("type");
      if (formType === "modal") {
        const modalAppResponse = await createModalApp({
          file_contents: values.modal.file_contents,
          requirements: [], // Will ultimately be handled by backend
          app_name: values.modal.app_name, // Will ultimately be determined by backend
          base_image_name: "python:3.8", // Will ultimately be handled by backend
          modal_function_names: values.modal.modal_functions.map((func: any) => func.function_name), // Will ultimately be handled by backend
          modal_functions: values.modal.modal_functions,
          owner_identity_id: auth?.authorization?.user?.sub,
        });
        gardenCreateRequest.modal_function_ids =
          modalAppResponse.data.modal_function_ids.map(parseInt);
      }

      const { garden } = await createGardenAndDOI(gardenCreateRequest);

      toast.success("Garden created successfully!");
      navigate(`/garden/${encodeURIComponent(garden.doi)}`);
    } catch (error) {
      toast.warning("Error creating garden.");
      console.error("Error creating garden:", error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Form {...form}>
        <CreateGardenFormFields />
        <LoadingOverlay />
        <UnsavedChangesDialog blocker={blocker} />
      </Form>
    </form>
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
