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
import { fileToString } from "../utils/garden.utils";
import { useValidateModalFile } from "../api/useValidateModalFile";

export const UploadModalFormFields = () => {
  const form = useFormContext();
  const [isFileUploading, setIsFileUploading] = React.useState(false);
  const { mutateAsync: validateModalFile } = useValidateModalFile();
  const [fileContents, setFileContents] = React.useState("");

  const handleFileUpload = async (
    field: ControllerRenderProps<FieldValues, "modal.file_contents">,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.error("Could not find file");
      return;
    }
    
    setIsFileUploading(true);
    try {
      const contents = await fileToString(file);
      const { modal_functions, app_name, base_image_name } = await validateModalFile({ 
        file_contents: contents 
      });

      if (!modal_functions) {
        throw new Error("Invalid modal file");
      }

      // Set all form values in a single batch
      form.reset((oldValues) => ({
        ...oldValues,
        modal: {
          file_contents: contents,
          app_name,
          base_image_name,
          modal_functions: modal_functions.map((func) => ({
            function_name: func.function_name,
            description: func.description,
            year: "2024",
            is_archived: false,
            doi: null,
            title: "",
            function_text: func.function_text,
            authors: [],
            tags: [],
            test_functions: [],
          })),
        }
      }));

      field.onChange(contents);
      setFileContents(contents);
    } catch (error) {
      field.onChange("");
      form.setError("modal.file_contents", {
        message: "Invalid modal file. Please see our user guide if you are having issues.",
      });
    } finally {
      setIsFileUploading(false);
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
                            placeholder="my-app-name"
                            className="w-full"
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
                  <FormField
                    control={form.control}
                    name="modal.base_image_name"
                    render={({ field }) => (
                      <FormItem className="mb-8">
                        <FormLabel className="font-bold">Base Image Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="python3.11"
                            className="w-full"
                          />
                        </FormControl>
                        <FormDescription>
                          The base image used by your Modal App.
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

export default UploadModalFormFields;
