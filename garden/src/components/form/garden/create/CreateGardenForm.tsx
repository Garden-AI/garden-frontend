import { useForm, useFormContext } from "react-hook-form";
import { useBlocker, useNavigate, useSearchParams } from "react-router-dom";
import { useCreateDOI, useCreateGardenAndDOI } from "@/api";
import { useGlobusAuth } from "@/components/auth/useGlobusAuth";
import { gardenFormSchema, GardenCreateFormData } from "./schemas";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import LoadingSpinner from "@/components/LoadingSpinner";
import { UnsavedChangesDialog } from "../../UnsavedChangesDialog";
import { CreateGardenFormFields } from "./CreateGardenFormFields";
import { useCreateModalApp } from "@/api/modal/useCreateModalApp";

export const CreateGardenForm = () => {
  const navigate = useNavigate();
  const auth = useGlobusAuth();

  const [searchParams, setSearchParams] = useSearchParams();
  const { createGardenAndDOI } = useCreateGardenAndDOI();
  const { mutateAsync: createModalApp } = useCreateModalApp();
  const { mutateAsync: createDOI } = useCreateDOI();

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
  console.log(form.formState);
  const onSubmit = async (values: GardenCreateFormData) => {
    try {
      const formType = searchParams.get("type");
      if (formType === "modal") {
        const doiValues = await Promise.all(
          values.modal.modal_functions.map(async (func: any) => {
            const { doi } = await createDOI(func);
            return doi;
          }),
        );
        console.log(doiValues);
        const createdAppResponse = await createModalApp({
          file_contents: values.modal.file_contents,
          requirements: [], // Will ultimately be handled by backend
          app_name: values.modal.app_name, // Will ultimately be determined by backend
          base_image_name: "python:3.8", // Will ultimately be handled by backend
          modal_function_names: values.modal.modal_functions.map((func: any) => func.function_name), // Will ultimately be handled by backend
          modal_functions: values.modal.modal_functions.map((func: any, index: number) => ({
            ...func,
            doi: doiValues[index],
          })),
          owner_identity_id: auth?.authorization?.user?.sub,
        });
        console.log(createdAppResponse);

        const { garden } = await createGardenAndDOI({
          ...values,
          modal_function_ids: createdAppResponse.data.modal_function_ids.map(parseInt),
        });
        toast.success("Modal App and Garden created successfully!");
        navigate(`/garden/${encodeURIComponent(garden.doi)}`);
      } else {
        const { garden } = await createGardenAndDOI(values);

        toast.success("Garden created successfully!");
        navigate(`/garden/${encodeURIComponent(garden.doi)}`);
      }
    } catch (error) {
      toast.warning("Error creating garden.");
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
