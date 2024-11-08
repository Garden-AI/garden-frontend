import { UseFormReturn, useFormContext } from "react-hook-form";
import { useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
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

import EntrypointCreateInstructions from "../EntrypointCreateInstructions";
import { SelectEntrypointsTable } from "../SelectEntrypointsTable";
import { UploadModalFormFields } from "../UploadModalFormFields";
import { GardenCreateFormData } from "../../types/garden.types";
import { tagOptions } from "../../utils/garden.utils";

export const CreateGardenFormFields = () => {
  const form = useFormContext() as UseFormReturn<GardenCreateFormData>;
  const { isSubmitting } = form.formState;

  const [searchParams, setSearchParams] = useSearchParams();
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

      {searchParams.get("type") === "modal" ? (
        <UploadModalFormFields />
      ) : (
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="mb-2 text-2xl font-bold">Entrypoints</h2>
            <p className="text-sm text-gray-700">
              Select the Entrypoints you want to include in your Garden. You can add or remove
              Entrypoints at any time.
            </p>

            <p className="text-sm text-gray-700"></p>
          </div>

          <SelectEntrypointsTable />
          <EntrypointCreateInstructions />
        </div>
      )}

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

      <div className="space-y-8">
        <h2 className="text-2xl font-bold">Miscellaneous</h2>

        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Language</FormLabel>
              <FormControl>
                <Input placeholder="en" {...field} />
              </FormControl>
              <FormDescription>The language of your Garden.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="version"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Version</FormLabel>
              <FormControl>
                <Input placeholder="1.0.0" {...field} />
              </FormControl>
              <FormDescription>The version of your Garden.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="mt-8 flex justify-end gap-2">
        <Button type="submit" className={"inline-block"}>
          {isSubmitting ? "Creating Garden..." : "Create Garden"}
        </Button>
      </div>
    </div>
  );
};
