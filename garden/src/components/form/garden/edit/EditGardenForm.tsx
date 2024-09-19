import { Garden, GardenPatchRequest } from "@/api/types";
import { useForm, useFormContext } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { formSchema, GardenPatchFormData } from "./schemas";
import { getDirtyValues } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { usePatchGarden } from "@/api";
import FormFields from "./FormFields";
import { UnsavedChangesDialog } from "../../UnsavedChangesDialog";
import { useBlocker } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";

export const EditGardenForm = ({ garden }: { garden: Garden }) => {
  const { mutateAsync: patchGarden } = usePatchGarden();

  const form = useForm<GardenPatchFormData>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: React.useMemo(
      () => ({
        title: garden.title || "",
        description: garden.description || "",
        year: garden.year || "",
        authors: garden.authors || [],
        version: garden.version || "",
        contributors: garden.contributors || [],
        tags: garden.tags || [],
      }),
      [garden],
    ),
  });

  const blocker = useBlocker(
    () => !form?.formState.isSubmitting && Object.keys(form.formState.touchedFields).length > 0,
  );

  const onSubmit = React.useCallback(
    async (values: GardenPatchFormData) => {
      const gardenPatchRequest: GardenPatchRequest = getDirtyValues(
        values,
        form.formState.dirtyFields,
      ) as GardenPatchRequest;

      await patchGarden({
        doi: garden.doi,
        garden: gardenPatchRequest,
      });
    },
    [garden.doi, patchGarden],
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
