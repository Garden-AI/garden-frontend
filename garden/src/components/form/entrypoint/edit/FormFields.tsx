import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import MultipleSelector from "@/components/ui/multiple-select";
import { Textarea } from "@/components/ui/textarea";
import AssociatedMaterials from "./AssociatedMaterials";
import { useFormContext, UseFormReturn } from "react-hook-form";
import { EntrypointPatchFormData } from "./schemas";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function FormFields() {
  const form = useFormContext() as UseFormReturn<EntrypointPatchFormData>;
  const navigate = useNavigate();

  return (
    <div className="space-y-8 rounded-lg border-0 bg-gray-100 p-10 text-sm text-gray-700">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Entrypoint title" {...field} />
            </FormControl>
            <FormDescription>
              The entrypoint's title. This title will be displayed on the entrypoint page and in
              search results.
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
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea placeholder="Description" {...field} />
            </FormControl>
            <FormDescription className="flex justify-between text-gray-500">
              <span>
                A brief description of the entrypoint. This description will be displayed on the
                entrypoint page and in search results.
              </span>

              <span> {field.value.length} / 1000</span>
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="authors"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Authors</FormLabel>
            <FormControl>
              <MultipleSelector
                {...field}
                className="bg-white"
                placeholder="Add authors"
                creatable
                onChange={(value) => {
                  field.onChange(value.map((v: any) => v.value));
                }}
                value={field.value.map((v: any) => ({ value: v, label: v }))}
              />
            </FormControl>
            <FormDescription>
              The main authors involved in producing this entrypoint. At least one author is
              required.
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
            <FormLabel>Tags</FormLabel>
            <FormControl>
              <MultipleSelector
                {...field}
                className="bg-white"
                placeholder="Add tags"
                creatable
                onChange={(value) => {
                  field.onChange(value.map((v: any) => v.value));
                }}
                value={field.value.map((v: any) => ({ value: v, label: v }))}
              />
            </FormControl>
            <FormDescription>Add tags to help others find your entrypoint.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <AssociatedMaterials />

      <div className="flex justify-end gap-x-4">
        <Button type="button" variant="outline" onClick={() => navigate("/")}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </div>
  );
}
