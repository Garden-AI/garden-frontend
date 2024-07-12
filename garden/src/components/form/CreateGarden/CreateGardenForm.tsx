import { useForm, useFormContext } from "react-hook-form";
import { useBlocker, useNavigate } from "react-router-dom";
import { useCreateGarden, useMintDOI } from "@/api";
import { useGlobusAuth } from "@/components/auth/useGlobusAuth";
import { useState } from "react";
import { formSchema, FormSchemaType } from "./FormSchema";
import { transformFormToRequest } from "./transformers";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import LoadingSpinner from "@/components/LoadingSpinner";
import { UnsavedChangesDialog } from "../UnsavedChangesDialog";
import { FormFields } from "./FormFields";

export const CreateGardenForm: React.FC = () => {
  const navigate = useNavigate();
  const mintDOI = useMintDOI();
  const auth = useGlobusAuth();
  const createGarden = useCreateGarden();

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      title: "",
      authors: [],
      contributors: [],
      entrypointIds: [],
      doi_is_draft: true,
      description: "",
      publisher: "Gardens-AI",
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

  const onSubmit = async (values: FormSchemaType) => {
    try {
      const ownerId = auth?.authorization?.user?.sub;
      if (!ownerId) {
        throw new Error("User not authenticated");
      }

      const { doi } = await mintDOI.mutateAsync();
      const requestData = transformFormToRequest(values, doi, ownerId);

      await createGarden.mutateAsync(requestData);
      toast.success("Garden created successfully!");
      navigate(`/garden/${encodeURIComponent(doi)}`);
    } catch (error) {
      toast.warning("Error creating garden. Please fix errors.");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Form {...form}>
        <FormFields />
        <LoadingOverlay />
      </Form>
      <UnsavedChangesDialog blocker={blocker} />
    </form>
  );
};

const LoadingOverlay = () => {
  const form = useFormContext();
  const { isSubmitting } = form.formState;

  return (
    isSubmitting && (
      <div className="fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-black/70">
        <LoadingSpinner />
      </div>
    )
  );
};
