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
import { Textarea } from "@/components/ui/textarea";
import ModalFunctions from "./ModalFunctions";
import { fileToString } from "./utils";
import { Link } from "react-router-dom";
import React from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";

export const UploadModalFormFields = () => {
  const form = useFormContext();
  const [isFileUploading, setIsFileUploading] = React.useState(false);

  const fileContents = form.watch("modal.file_contents");

  const handleFileUpload = async (
    field: ControllerRenderProps<FieldValues, "modal.file_contents">,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsFileUploading(true);
      // TODO: Add call to backend that validates the file and returns the app name and functions
      setTimeout(async () => {
        // Simulate file upload (This will be removed when the above TODO is completed)
        try {
          const fileContents = await fileToString(file);
          field.onChange(fileContents);
        } catch (error) {
          console.error("Error reading file:", error);
        } finally {
          setIsFileUploading(false);
        }
      }, 2000);
    }
  };

  return (
    <div className="py-8">
      <div className="space-y-8">
        <section>
          <h2 className="mb-2 text-2xl font-bold">Modal App</h2>
          <p className="mb-4 text-sm text-gray-500">
            If you have a Python file that defines a Modal App, you can upload it here. The file
            should contain a modal.App() definition. Please see our{" "}
            <Link to="" className="font-bold text-primary">
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
                  {field.value && (
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => {
                        form.reset({
                          modal: { file_contents: "", app_name: "", modal_functions: [] },
                        });
                      }}
                    >
                      Clear
                    </Button>
                  )}
                  <FormDescription>Your modal file containing your app definition</FormDescription>
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
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="modal.app_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold">App Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="my-modal-app"
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
                  </div>
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
