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
import React from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { fileToString } from "../utils/garden.utils";
import { useValidateModalFile } from "../api/useValidateModalFile";

export const UploadModalFormFields = () => {
  const form = useFormContext();
  const [isFileUploading, setIsFileUploading] = React.useState(false);
  const { mutateAsync: validateModalFile } = useValidateModalFile();

  const fileContents = form.watch("modal.file_contents");

  const handleFileUpload = async (
    field: ControllerRenderProps<FieldValues, "modal.file_contents">,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsFileUploading(true);
      try {
        const { is_valid, functions, app_name, pip_requirements, base_image_requirements } =
          await validateModalFile({ file });

        if (!is_valid) {
          field.onChange("");
          form.setError("modal.file_contents", {
            message: "Invalid modal file. Please see our user guide if you are having issues.",
          });
          throw new Error("Invalid modal file");
        }

        form.setValue("modal.app_name", app_name);

        form.reset({ modal: { modal_functions: [] } });
        form.setValue(
          "modal.modal_functions",
          functions.map((func) => ({
            function_name: func.name,
            description: "",
            year: "2024",
            is_archived: false,
            doi: null,
            title: "",
            function_text: func.function_text,
            authors: [],
            tags: [],
            test_functions: [],
          })),
        );

        const fileContents = await fileToString(file);
        field.onChange(fileContents);
      } catch (error) {
        console.error("Error reading file:", error);
      } finally {
        setIsFileUploading(false);
      }
    }
  };

  return (
    <div className="py-8">
      <div className="space-y-8">
        <section>
          <h2 className="mb-2 text-2xl font-bold">Modal App</h2>
          <p className="mb-4 text-sm text-gray-500">
            Upload a Python file that defines your Modal App. Please see our{" "}
            <Link
              to="https://garden-ai.readthedocs.io/en/latest/user_guide/modal-publishing/"
              className="font-bold text-primary"
            >
              user guide
            </Link>{" "}
            for more information.{" "}
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
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleFileUpload(field, e)
                      }
                      className="h-14 file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-violet-700 hover:file:bg-violet-100"
                    />
                  </FormControl>
                  <FormDescription>Your modal file containing your app definition.</FormDescription>
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
                <div className="">
                  <FormField
                    control={form.control}
                    name="modal.app_name"
                    render={({ field }) => (
                      <FormItem className="mb-8">
                        <FormLabel className="font-bold">App Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="my-modal-app"
                            className="w-full"
                            disabled
                          />
                        </FormControl>
                        <FormDescription>
                          The name of your Modal App. It is the string inside modal.App() in your
                          Python file.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
