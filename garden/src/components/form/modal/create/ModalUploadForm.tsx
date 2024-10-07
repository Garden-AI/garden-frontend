import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useCreateModalApp } from "@/api/modal/useCreateModalApp";
import { Button } from "@/components/ui/button";
import { useGlobusAuth } from "@/components/auth/useGlobusAuth";
import { useCreateGardenAndDOI } from "@/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ModalUploadFormData, formSchema } from "./schemas";
import { FormFields } from "./FormFields";

export const ModalUploadForm = () => {
  const auth = useGlobusAuth();
  const { mutateAsync: createModalApp } = useCreateModalApp();
  const { createGardenAndDOI } = useCreateGardenAndDOI();
  const navigate = useNavigate();

  const [loadingMessage, setLoadingMessage] = useState<string>("");

  const form = useForm<ModalUploadFormData>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      title: "",
      description: "",
      fileContents: "",
      modal_functions: [
        {
          title: "",
          description: "",
          function_name: "",
          year: "2024",
          doi: "fake-doi",
        },
      ],
    },
  });

  const onSubmit = async (values: any) => {
    if (!auth.authorization?.user?.sub) {
      throw new Error("Must be authenticated");
    }
    try {
      // Create the Modal App
      setLoadingMessage(() => "Creating modal app...");
      await createModalApp({
        file_contents: values.fileContents,
        requirements: [], // Will ultimately be handled by backend
        app_name: "example-get-started", // Will ultimately be determined by backend
        version: "1.0.0",
        base_image_name: "python:3.8", // Will ultimately be handled by backend (I think)
        is_archived: false,
        modal_function_names: values.modal_functions.map((func: any) => func.function_name), // Will ultimately be handled by backend
        modal_functions: values.modal_functions,
        owner_identity_id: Number(auth.authorization.user.sub), // Right now backend expects int, should be a string ultimately but for now this is fine as it's not saving to DB
      });

      // Create the Garden
      setLoadingMessage(() => "Creating garden...");
      createGardenAndDOI({
        title: values.title,
        description: values.description,
        owner_identity_id: auth.authorization.user.sub,
        is_archived: false,
        publisher: "thegardens.ai",
        language: "en",
        version: "1.0.0",
      })
        .then(({ garden }) => {
          navigate(`/garden/${encodeURIComponent(garden.doi)}`);
        })
        .finally(() => {
          setLoadingMessage(() => "");
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Form {...form}>
        <FormFields />
        <Button type="submit">Submit</Button>
        <LoadingOverlay loadingMessage={loadingMessage} />
      </Form>
    </form>
  );
};

const LoadingOverlay = ({ loadingMessage }: { loadingMessage: string }) => {
  return (
    loadingMessage && (
      <div className="no-doc-scroll fixed bottom-0 left-0 right-0 top-0 z-50 flex flex-col items-center justify-center space-y-4 bg-black/70">
        <h2 className="font-display text-2xl text-white">{loadingMessage}</h2>
        <LoadingSpinner />
      </div>
    )
  );
};
