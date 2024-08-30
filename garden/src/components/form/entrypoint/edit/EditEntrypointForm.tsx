import { useBlocker } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";
import { usePatchEntrypoint } from "@/api";
import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import React from "react";
import { Entrypoint } from "@/api/types";
import { EntrypointEditFormData, formSchema } from "./schemas";
import { UnsavedChangesDialog } from "../../UnsavedChangesDialog";
import FormFields from "./FormFields";

const getEntrypointValues = (entrypoint: Entrypoint) => ({
  title: entrypoint.title || "",
  description: entrypoint.description || "",
  year: entrypoint.year || "",
  authors:
    entrypoint.authors?.map((author) => ({ value: author, label: author })) ||
    [],
  tags: entrypoint.tags?.map((tag) => ({ value: tag, label: tag })) || [],
  repositories: entrypoint.repositories || [],
  datasets: entrypoint.datasets || [],
  papers: entrypoint.papers || [],
});

export const EditEntrypointForm = ({
  entrypoint,
}: {
  entrypoint: Entrypoint;
}) => {
  const { mutateAsync: updateEntrypoint } = usePatchEntrypoint();

  const form = useForm<EntrypointEditFormData>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: React.useMemo(
      () =>
        entrypoint
          ? getEntrypointValues(entrypoint)
          : {
              title: "",
              description: "",
              year: "",
              authors: [],
              tags: [],
              repositories: [],
              datasets: [],
              papers: [],
            },
      [entrypoint],
    ),
  });

  const blocker = useBlocker(
    () =>
      !form?.formState.isSubmitting &&
      Object.keys(form.formState.touchedFields).length > 0,
  );

  React.useEffect(() => {
    if (entrypoint) {
      form.reset(getEntrypointValues(entrypoint));
    }
  }, [entrypoint, form]);

  const onSubmit = React.useCallback(
    async (values: EntrypointEditFormData) => {
      const updatedEntrypoint = {
        ...values,
        authors: values.authors.map((author) => author.value),
        tags: values.tags.map((tag) => tag.value),
      };
      await updateEntrypoint({
        doi: entrypoint.doi,
        entrypoint: updatedEntrypoint,
      });
    },
    [entrypoint.doi, updateEntrypoint],
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
