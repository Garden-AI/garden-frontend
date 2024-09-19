import { useBlocker } from "react-router-dom";
import { usePatchEntrypoint } from "@/api";
import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import React from "react";
import { Entrypoint, EntrypointPatchRequest } from "@/api/types";
import { EntrypointPatchFormData, formSchema } from "./schemas";
import { UnsavedChangesDialog } from "../../UnsavedChangesDialog";
import FormFields from "./FormFields";
import { getDirtyValues } from "@/lib/utils";
import LoadingSpinner from "@/components/LoadingSpinner";

export const EditEntrypointForm = ({ entrypoint }: { entrypoint: Entrypoint }) => {
  const { mutateAsync: patchEntrypoint } = usePatchEntrypoint();

  const form = useForm<EntrypointPatchFormData>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: React.useMemo(
      () => ({
        title: entrypoint.title || "",
        description: entrypoint.description || "",
        year: entrypoint.year || "",
        authors: entrypoint.authors || [],
        tags: entrypoint.tags || [],
        repositories: entrypoint.repositories || [],
        datasets: entrypoint.datasets || [],
        papers: entrypoint.papers || [],
      }),
      [entrypoint],
    ),
  });

  const blocker = useBlocker(
    () => !form?.formState.isSubmitting && Object.keys(form.formState.touchedFields).length > 0,
  );

  const onSubmit = React.useCallback(
    async (values: EntrypointPatchFormData) => {
      const entrypointPatchRequest: EntrypointPatchRequest = getDirtyValues(
        values,
        form.formState.dirtyFields,
      ) as EntrypointPatchRequest;

      await patchEntrypoint({
        doi: entrypoint.doi,
        entrypoint: entrypointPatchRequest,
      });
    },
    [entrypoint.doi, patchEntrypoint],
  );

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
