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
import Breadcrumb from "@/components/Breadcrumb";

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

      const { doi } = await mintDOI.mutateAsync();
      const requestData = transformFormToRequest(values, doi, ownerId);

      await createGarden.mutateAsync(requestData);

      toast.success("Garden created successfully!");
      setIsSubmitting(false);
      navigate(`/garden/${encodeURIComponent(doi)}`);
    } catch (error) {
      setIsSubmitting(false);
      toast.warning("Error creating garden. Please fix errors.");
    }
  };

  return (
    <div
      className="mx-auto max-w-6xl px-4 py-8 font-display"
      aria-busy={isSubmitting}
    >
      <Breadcrumb
        crumbs={[
          { label: "Home", link: "/" },
          { label: "Gardens", link: "/search" },
          { label: "Create Garden" },
        ]}
      />
      <div className="mb-16 flex items-center space-x-8">
        <div className="relative h-96 w-96 flex-shrink-0">
          <img
            src="img/AIGeneratedImg.png"
            alt="Garden AI Logo"
            className="absolute inset-0 h-full w-full rounded-lg object-cover"
          />
        </div>
        <div className="flex-grow space-y-4">
          <h1 className="text-4xl font-light">Create a Garden</h1>
          <p className="text-sm text-gray-700">
            Gardens collect and organize Entrypoints, making it easy for others
            to discover and use your work.
          </p>
          <p className="text-sm text-gray-700">
            Start by giving your Garden a title and description, and one or more
            entrypoints.
          </p>
        </div>
      </div>

      <FormFields form={form} onSubmit={onSubmit} isSubmitting={isSubmitting} />

      <UnsavedChangesDialog blocker={blocker} />

      {isSubmitting && (
        <div className="fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-black/70">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}
