import EntrypointBox from "@/components/EntrypointBox";
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
import MultipleSelector from "@/components/ui/multiple-select";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function FormFields() {
  const navigate = useNavigate();
  const form = useFormContext();
  return (
    <div className="space-y-8 rounded-lg border-0 bg-gray-100 p-10 text-sm text-gray-700">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Garden Title *</FormLabel>
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
            <FormLabel>Description *</FormLabel>
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
        name="authors"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Authors *</FormLabel>
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
              The main researchers involved in producing the Garden. At least one author is required
              in order to register a DOI.
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
            <FormLabel>
              Contributors <span className="text-gray-500">(optional)</span>
            </FormLabel>
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
              Acknowledge contributors to the development of this Garden, outside of those listed as
              authors.
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

      <FormField
        control={form.control}
        name="version"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Version</FormLabel>
            <FormControl>
              <Input placeholder="1.0.0" {...field} />
            </FormControl>
            <FormDescription>The version of your garden.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* <div className="space-y-2">
        <p className="text-gray-600">Entrypoints</p>
        {garden?.entrypoints && garden.entrypoints.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {garden.entrypoints.map((entrypoint: any) => (
              <EntrypointBox key={entrypoint.doi} entrypoint={entrypoint} garden={garden} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No Entrypoints created yet.</p>
        )}
      </div> */}

      <div className="flex justify-end gap-x-4">
        <Button type="button" variant="outline" onClick={() => navigate(`/user`)}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </div>
  );
}
