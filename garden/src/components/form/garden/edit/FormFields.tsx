import { useNavigate } from "react-router-dom";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MultipleSelector from "@/components/ui/multiple-select";
import { SelectEntrypointsTable } from "../SelectEntrypointsTable";

export default function FormFields() {
  const navigate = useNavigate();
  const form = useFormContext();
  console.log(form.getValues("doi_is_draft"));

  return (
    <div className="space-y-12 rounded-xl bg-white p-8 shadow-lg">
      <h1 className=" text-2xl font-bold sm:text-3xl">Edit Garden</h1>

      <section>
        <h2 className="mb-6 border-b pb-2 text-2xl font-bold text-gray-800">General</h2>
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-gray-700">Garden Title</FormLabel>
                <FormControl>
                  <Input placeholder="My Garden" {...field} className="w-full" />
                </FormControl>
                <FormDescription>Your Garden's public display name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-gray-700">Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about your garden"
                    className="resize-vertical min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide a high-level overview of your Garden, its purpose, and contents. This will
                  be displayed on the Garden page and in search results.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-6 border-b pb-2 text-2xl font-bold text-gray-800">Contributors</h2>
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="authors"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-gray-700">Authors</FormLabel>
                <FormControl>
                  <MultipleSelector
                    {...field}
                    placeholder="Add authors"
                    creatable
                    onChange={(value) => {
                      field.onChange(value.map((v: any) => v.value));
                    }}
                    value={field.value.map((v: any) => ({ value: v, label: v }))}
                    className="w-full"
                  />
                </FormControl>
                <FormDescription>
                  List the main researchers involved in producing the Garden. At least one author is
                  required for DOI registration.
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
                <FormLabel className="font-bold text-gray-700">Contributors</FormLabel>
                <FormControl>
                  <MultipleSelector
                    {...field}
                    placeholder="Add contributors"
                    creatable
                    onChange={(value) => {
                      field.onChange(value.map((v: any) => v.value));
                    }}
                    value={field.value.map((v: any) => ({ value: v, label: v }))}
                    className="w-full"
                  />
                </FormControl>
                <FormDescription>
                  Acknowledge additional contributors to the Garden's development.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-6 border-b  text-2xl font-bold text-gray-800">Entrypoints</h2>
        <p className="mb-8 text-sm text-muted-foreground">
          Select the entrypoints that are part of your garden. These entrypoints will be displayed
          on the Garden page. Only unpublished gardens can modify their entrypoints.
        </p>
        <SelectEntrypointsTable />
      </section>

      <section>
        <h2 className="mb-6 border-b pb-2 text-2xl font-bold text-gray-800">Misc</h2>
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-gray-700">Tags</FormLabel>
                <FormControl>
                  <MultipleSelector
                    {...field}
                    className="w-full"
                    placeholder="Add tags"
                    creatable
                    onChange={(value) => {
                      field.onChange(value.map((v: any) => v.value));
                    }}
                    value={field.value.map((v: any) => ({ value: v, label: v }))}
                  />
                </FormControl>
                <FormDescription>Add relevant tags to improve discoverability.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="version"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-gray-700">Version</FormLabel>
                <FormControl>
                  <Input placeholder="1.0.0" {...field} className="w-full max-w-xs" />
                </FormControl>
                <FormDescription>
                  Specify the current version of your garden (e.g., 1.0.0).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </section>

      <div className="mt-8 flex justify-end gap-x-4">
        <Button type="button" variant="outline" onClick={() => navigate(`/user`)}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </div>
  );
}
