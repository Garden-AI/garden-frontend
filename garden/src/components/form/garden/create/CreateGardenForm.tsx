import { useForm, useFormContext } from "react-hook-form";
import { useBlocker, useNavigate } from "react-router-dom";
import { useCreateGarden, useMintDOI } from "@/api";
import { useGlobusAuth } from "@/components/auth/useGlobusAuth";
import { formSchema, GardenCreateFormData } from "./schemas";
import { transformFormToRequest } from "./transformers";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import LoadingSpinner from "@/components/LoadingSpinner";
import { UnsavedChangesDialog } from "../../UnsavedChangesDialog";
import { FormFields } from "./FormFields";
import { GardenCreateRequest } from "@/api/types";

export const CreateGardenForm = () => {
  const navigate = useNavigate();
  const auth = useGlobusAuth();
  const { mutateAsync: mintDOI } = useMintDOI();
  const { mutateAsync: createGarden } = useCreateGarden();

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
    },
  });

  const blocker = useBlocker(
    () =>
      !form?.formState.isSubmitting &&
      Object.keys(form.formState.touchedFields).length > 0,
  );

  const onSubmit = async (values: GardenCreateFormData) => {
    try {
      const ownerId = auth?.authorization?.user?.sub;
      if (!ownerId) {
        throw new Error("User not authenticated");
      }
      const { doi } = await mintDOI();
      const requestData: GardenCreateRequest = transformFormToRequest(
        values,
        doi,
        ownerId,
      );

      const res = await createGarden(requestData);
      toast.success("Garden created successfully!");
      navigate(`/garden/${encodeURIComponent(requestData.doi)}`);
    } catch (error) {
      toast.warning("Error creating garden. Please fix errors.");
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
