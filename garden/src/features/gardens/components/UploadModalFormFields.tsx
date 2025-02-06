import React from 'react';
import { ControllerRenderProps, FieldValues, useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ModalFunctions from "./ModalFunctions";
import { Link } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ApiError, fileToString } from "../utils/garden.utils";
import { useValidateModalFile } from "../api/useValidateModalFile";
import { GardenCreateFormData } from '../types/garden.types';
import { AxiosError } from 'axios';

export const UploadModalFormFields = () => {
  const form = useFormContext<GardenCreateFormData>();
  const [isFileUploading, setIsFileUploading] = React.useState(false);
  const { mutateAsync: validateModalFile } = useValidateModalFile();
  const [fileContents, setFileContents] = React.useState("");

  const appName = form.watch("modal.app_name");

  const handleFileUpload = async (
    field: ControllerRenderProps<GardenCreateFormData, "modal.file_contents">,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.error("Could not find file");
      return;
    }
    setIsFileUploading(true);
    form.clearErrors("modal.file_contents");

    try {
      const contents = await fileToString(file);
      const { modal_functions, app_name, base_image_name } = await validateModalFile({
        file_contents: contents
      });

      if (!modal_functions) {
        throw new Error("Invalid modal file");
      }

      // Set all form values in a single batch
      const currentYear = new Date().getFullYear().toString();
      form.reset((oldValues) => ({
        ...oldValues,
        modal: {
          file_contents: contents,
          app_name,
          base_image_name,
          modal_functions: modal_functions.map((func) => ({
            function_name: func.function_name,
            description: func.description || "",
            pip_requirements: func.requirements,
            conda_requirements: func.conda_requirements,
            year: currentYear,
            is_archived: false,
            doi: null,
            title: "",
            function_text: func.function_text,
            authors: [],
            tags: [],
            test_functions: func.test_functions || [],
            example_usage: func.example_usage || "",
          })),
        }
      }));

      field.onChange(contents);
      setFileContents(contents);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        error = ApiError.fromAxiosError(error);
      }
      console.log(`Error validating modal file: ${error}`);
      const msg = `${error} Please see our user guide if you are having issues.`
      form.setError("modal.file_contents", { type: "validate", message: msg });
      form.setError("modal", { type: "validate", message: msg });
    } finally {
      setIsFileUploading(false);
    }
  };

  let sectionTitle = "Modal App";
  if (appName) {
    sectionTitle += `: ${appName}`;
  }

  return (
    <div className="py-8">
      <div className="space-y-8">
        <section>
          <h2 className="mb-2 text-2xl font-bold">{sectionTitle}</h2>
          <p className="mb-4 text-sm text-gray-500">
            Upload a Python file that defines your Modal App. Please see our{" "}
            <Link
              to="https://garden-ai.readthedocs.io/en/latest/user_guide/modal-publishing/"
              className="font-bold text-primary"
            >
              user guide
            </Link>{" "}
            for more information.
          </p>
        </section>

        <section>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="modal.file_contents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">File</FormLabel>
                  <FormControl>
                    <Input
                      id="file"
                      type="file"
                      accept=".py"
                      onChange={(e) => handleFileUpload(field, e)}
                      className="h-14 file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-violet-700 hover:file:bg-violet-100"
                    />
                  </FormControl>
                  <FormDescription>
                    Your modal file containing your app definition.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isFileUploading ? (
              <div className="flex flex-col items-center justify-center space-x-2">
                <span>Uploading...</span>
                <div className="h-16 w-16">
                  <LoadingSpinner />
                </div>
              </div>
            ) : (
              fileContents && (
                <div>
                  <ModalFunctions />
                </div>
              )
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default UploadModalFormFields;
