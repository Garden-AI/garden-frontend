import { ModalFunction, ModalFunctionPatchRequest } from "@/types";
import { useForm, useFormContext } from "react-hook-form";
import { Form } from "@/components/shadcn/form";
import { modalFunctionFormSchema, ModalFunctionPatchFormData } from "../../types/modal.types";
import { getDirtyValues } from "@/utils/form.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { usePatchModalFunction } from "../../api/usePatchModalFunction";
import EditModalFunctionFormFields from "./EditModalFunctionFormFields";
import { UnsavedChangesDialog } from "@/components/UnsavedChangesDialog";
import { useBlocker, useNavigate } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";
import { toast } from "sonner";
import { Button } from "@/components/shadcn/button";

export const EditModalFunctionForm = ({ modalFunction }: { modalFunction: ModalFunction }) => {
  const { mutateAsync: patchModalFunction } = usePatchModalFunction();
  const navigate = useNavigate();

  const form = useForm<ModalFunctionPatchFormData>({
    resolver: zodResolver(modalFunctionFormSchema),
    mode: "onTouched",
    defaultValues: React.useMemo(
      () => ({
        title: modalFunction.title || "",
        description: modalFunction.description || "",
        year: modalFunction.year || "",
        authors: modalFunction.authors || [],
        tags: modalFunction.tags || [],
        example_usage: modalFunction.example_usage || "",
        papers: modalFunction.papers || [],
        repositories: modalFunction.repositories || [],
        datasets: modalFunction.datasets || [],
      }),
      [modalFunction],
    ),
  });

  const blocker = useBlocker(
    () => !form?.formState.isSubmitting && Object.keys(form.formState.touchedFields).length > 0,
  );

  const onSubmit = React.useCallback(
    async (values: ModalFunctionPatchFormData) => {
      try {
        const modalFunctionPatchRequest: ModalFunctionPatchRequest = getDirtyValues(
          values,
          form.formState.dirtyFields,
        ) as ModalFunctionPatchRequest;
        
        await patchModalFunction({
          id: modalFunction.id,
          modalFunction: modalFunctionPatchRequest,
        });

        toast.success("Modal function updated successfully");
        navigate(`/modal-functions/${modalFunction.id}`);
      } catch (error) {
        toast.error("Failed to update modal function");
      }
    },
    [modalFunction.id, patchModalFunction, navigate],
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="p-6">
            <EditModalFunctionFormFields />
          </div>
        </div>
        
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/modal-functions/${modalFunction.id}`)}
          >
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>

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