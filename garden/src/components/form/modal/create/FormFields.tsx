import React from "react";
import { useFormContext } from "react-hook-form";
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

export const FormFields = () => {
  const form = useFormContext();

  return (
    <div className="py-8">
      <h1 className="mb-8 text-center text-3xl font-bold">Create Garden with Modal Functions</h1>

      <div className="space-y-8">
        <section>
          <h2 className="mb-4 text-xl font-semibold">Garden</h2>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Title</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" placeholder="Python Garden" className="w-full" />
                  </FormControl>
                  <FormDescription>
                    The title of your Garden. This will be displayed on the Garden page and appear
                    in search results.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="app_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">App Name</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" placeholder="my-modal-app" className="w-full" />
                  </FormControl>
                  <FormDescription>
                    The name of your Modal App. It is the string inside modal.App() in your Python file.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A Garden for all things Python"
                      className="h-24 w-full resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A high level overview of your Garden, its purpose, and its contents. This will
                    be displayed on the Garden page and appear in search results.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold">Modal Functions</h2>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="fileContents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">File</FormLabel>
                  <FormControl>
                    <Input
                      id="file"
                      type="file"
                      accept=".py"
                      onChange={async (event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          try {
                            const fileContents = await fileToString(file);
                            field.onChange(fileContents);
                          } catch (error) {
                            console.error("Error reading file:", error);
                          }
                        }
                      }}
                      className="h-14 file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-violet-700 hover:file:bg-violet-100"
                    />
                  </FormControl>
                  <FormDescription>Your modal file containing your app definition</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ModalFunctions />
          </div>
        </section>
      </div>
    </div>
  );
};
