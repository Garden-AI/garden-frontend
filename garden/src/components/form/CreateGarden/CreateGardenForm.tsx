import { useBlocker, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchemaType, formSchema } from "./FormSchema";
import { transformFormToRequest } from "./transformers";

import { useCreateGarden, useMintDOI } from "@/api";

import { toast } from "sonner";
import { UnsavedChangesDialog } from "../UnsavedChangesDialog";
import { useState } from "react";
import { useGlobusAuth } from "@/components/auth/useGlobusAuth";
import { FormFields } from "./FormFields";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function CreateGardenForm() {
  const navigate = useNavigate();
  const createGarden = useCreateGarden();
  const mintDOI = useMintDOI();
  const auth = useGlobusAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      title: "",
      authors: [],
      contributors: [],
      entrypoint_ids: [],
      doi_is_draft: true,
      description: "",
      publisher: "",
      year: "2024",
      language: "en",
      tags: [],
      version: "1.0.0",
    },
  });

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      !isSubmitting &&
      currentLocation.pathname !== nextLocation.pathname &&
      Object.keys(form.formState.touchedFields).length > 0,
  );

  const onSubmit = async (values: FormSchemaType) => {
    setIsSubmitting(true);
    try {
      const ownerId = auth?.authorization?.user?.sub;
      if (!ownerId) {
        throw new Error("User not authenticated");
      }
      toast.success("Garden created successfully!");

      const { doi } = await mintDOI.mutateAsync();
      const requestData = transformFormToRequest(values, doi, ownerId);
      console.log(requestData);
      setIsSubmitting(false);
      return;
      const result = await createGarden.mutateAsync(requestData);
      toast.success("Garden created successfully!");

      navigate(`/garden/${encodeURIComponent(doi)}`);
    } catch (error) {
      toast.warning("Error creating garden. Please fix errors.");
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="mx-auto max-w-6xl px-4 py-8 font-display"
      aria-busy={isSubmitting}
    >
      <h1 className="mb-12 text-center text-3xl">Create a Garden</h1>
      {isSubmitting && (
        <div className="fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-black/70">
          <LoadingSpinner />
        </div>
      )}
      <FormFields form={form} onSubmit={onSubmit} isSubmitting={isSubmitting} />

      <UnsavedChangesDialog blocker={blocker} />
    </div>
  );
}
