import { UseFormReturn, useFormContext } from "react-hook-form";

import { FlaskConicalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import MultipleSelector from "@/components/ui/multiple-select";
import { Textarea } from "@/components/ui/textarea";

import { SelectModalFunctionsTable } from "../SelectModalFunctionsTable";
import { UploadModalFormFields } from "../UploadModalFormFields";
import { GardenCreateFormData } from "../../types/garden.types";
import { tagOptions } from "../../utils/garden.utils";

interface CreateGardenFormFieldsProps {
  hideModalUpload?: boolean;
}

export const CreateGardenFormFields = ({ hideModalUpload = false }: CreateGardenFormFieldsProps) => {
  const form = useFormContext() as UseFormReturn<GardenCreateFormData>;
  const { isSubmitting } = form.formState;

  const isTestGarden = form.watch("is_test");
  const formType = searchParams.get("type");
  const modalApp = form.watch("modal");
  const currentModalFunctionIds = form.watch("modal_function_ids") || [];
  
  // Check if garden is published to disable modal function selection
  const isPublished = form.watch("doi_is_draft") === false && form.watch("is_archived") === false;

  return (
    <div className="space-y-12">
      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">General</h2>
          <p className="text-sm text-gray-700">General information about your Garden.</p>
        </div>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Title</FormLabel>
              <FormControl>
                <Input placeholder="My Garden" {...field} />
              </FormControl>
              <FormDescription>This is your Garden's public display name.</FormDescription>
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
                  placeholder="Tell us about your garden"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A high level overview of your Garden, its purpose, and its contents. This will be
                displayed on the Garden page and appear in search results.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Tags</FormLabel>
              <FormControl>
                <MultipleSelector
                  {...field}
                  groupBy="group"
                  placeholder="Add tags to your garden"
                  creatable
                  hideClearAllButton
                  defaultOptions={tagOptions}
                  maxSelected={5}
                  hidePlaceholderWhenSelected
                  inputProps={{ maxLength: 32 }}
                  onChange={(value) => {
                    field.onChange(value.map((v: any) => v.value));
                  }}
                  value={field.value.map((v: any) => ({ value: v, label: v }))}
                />
              </FormControl>
              <FormDescription>
                Tags to help categorize and improve the discoverability your Garden.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-8">
          {hideModalUpload ? (
        <div className="rounded-lg border bg-gray-50 p-4">
          <h2 className="text-xl font-bold">Modal App</h2>
          <p className="mt-2 text-sm text-gray-700">
            Your Modal app has been deployed successfully. You can now create a Garden with it.
          </p>
  
          {modalApp.modal_functions?.length > 0 && (
            <div className="mt-4">
              <h3 className="text-md font-semibold">Functions</h3>
              <ul className="mt-2 list-inside list-disc">
                {modalApp.modal_functions.map((func: any, index: number) => (
                  <li key={index} className="text-sm">
                    {func.function_name}: {func.title || "Untitled"}
                  </li>
                ))}
              </ul>
            </div>
          )}
              
              {/* Add the ability to select other modal functions the user owns */}
              <div className="mt-8">
                <SelectModalFunctionsTable 
                  currentFunctionIds={currentModalFunctionIds}
                  published={isPublished}
                />
              </div>
        </div>
        ) : (
        <UploadModalFormFields />
        )}
        </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-semibold">Visibility Settings</h2>
        <div className="mt-8">
          <FormField
            control={form.control}
            name="is_test"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-white p-4">
                  <div className="flex items-center gap-2">
                    <FlaskConicalIcon className="h-5 w-5 text-gray-500" />
                    <div>
                      <h3 className="text-base font-medium text-gray-900">Make this a test Garden</h3>
                      <p className="text-sm text-gray-500">If checked, this Garden will not be visible in search results. (You can change this later)</p>
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-primary"
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold">Contributors</h2>
        <FormField
          control={form.control}
          name="authors"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Authors</FormLabel>
              <FormControl>
                <MultipleSelector
                  {...field}
                  placeholder="Add authors"
                  creatable
                  onChange={(value) => {
                    field.onChange(value.map((v: any) => v.value));
                  }}
                  value={field.value.map((v: any) => ({ value: v, label: v }))}
                />
              </FormControl>
              <FormDescription>
                The main researchers involved in producing the Garden. At least one author is
                required in order to register a DOI.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contributors"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Contributors</FormLabel>
              <FormControl>
                <MultipleSelector
                  {...field}
                  placeholder="Add contributors"
                  creatable
                  onChange={(value) => {
                    field.onChange(value.map((v: any) => v.value));
                  }}
                  value={field.value.map((v: any) => ({ value: v, label: v }))}
                />
              </FormControl>
              <FormDescription>
                Acknowledge contributors to the development of this Garden, outside of those listed
                as authors.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="mt-8 flex justify-end gap-2">
        <Button type="submit" className={"inline-block"}>
          {isSubmitting ? "Creating Garden..." : `Create ${isTestGarden ? "Test" : ""} Garden`}
        </Button>
      </div>
    </div>
  );
};
