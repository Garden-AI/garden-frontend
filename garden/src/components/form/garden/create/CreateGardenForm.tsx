import { useForm, useFormContext } from "react-hook-form";
import { useBlocker, useNavigate } from "react-router-dom";
import { useCreateGardenAndDOI } from "@/api";
import { useGlobusAuth } from "@/components/auth/useGlobusAuth";
import { formSchema, GardenCreateFormData } from "./schemas";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import LoadingSpinner from "@/components/LoadingSpinner";
import { UnsavedChangesDialog } from "../../UnsavedChangesDialog";
import { FormFields } from "./FormFields";

export const CreateGardenForm = () => {
  const navigate = useNavigate();
  const auth = useGlobusAuth();

  const { createGardenAndDOI } = useCreateGardenAndDOI();

  const form = useForm<GardenCreateFormData>({
    resolver: zodResolver(formSchema),
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
    },
  });

  const blocker = useBlocker(
    () => !form?.formState.isSubmitting && Object.keys(form.formState.touchedFields).length > 0,
  );

  const onSubmit = async (values: GardenCreateFormData) => {
    try {
      const { garden } = await createGardenAndDOI(values);

      toast.success("Garden created successfully!");
      navigate(`/garden/${encodeURIComponent(garden.doi)}`);
    } catch (error) {
      toast.warning("Error creating garden.");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Form {...form}>
        <FormFields />
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
