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
import { useCreateModalApp } from "../../api/useCreateModalApp";
import { useCreateGardenAndDOI } from "../../api/useCreateGardenAndDOI";
import { GardenCreateRequest } from "@/types";
import { ApiError } from "../../utils/garden.utils";
import { AxiosError } from "axios";

export const CreateGardenForm = () => {
  const navigate = useNavigate();
  const auth = useGlobusAuth();
  const uuid = auth?.authorization?.user?.sub;

  const [searchParams] = useSearchParams();
  const { createGardenAndDOI } = useCreateGardenAndDOI();
  const { mutateAsync: createModalApp } = useCreateModalApp();

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
      };

      const formType = searchParams.get("type");
      if (formType === "modal") {
        const modalAppResponse = await createModalApp({
          file_contents: values.modal.file_contents,
          requirements: [],
          app_name: values.modal.app_name,
          base_image_name: values.modal.base_image_name,
          modal_functions: values.modal.modal_functions,
          owner_identity_id: uuid,
          overwrite_existing: true,
        });
        gardenCreateRequest.modal_function_ids = modalAppResponse.data.modal_function_ids.map(id => parseInt(id));
      }

      const { garden } = await createGardenAndDOI(gardenCreateRequest);

      toast.success("Garden created successfully!");
      navigate(`/garden/${encodeURIComponent(garden.doi)}`);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
         error = ApiError.fromAxiosError(error);
      }
      console.error(error);
      toast.error(`${error} Please check the form and and try again.`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CreateGardenFormFields />
        <LoadingOverlay />
        <UnsavedChangesDialog blocker={blocker} />
      </form>
    </Form>
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
