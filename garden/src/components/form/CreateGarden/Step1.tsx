import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn, useFormContext } from "react-hook-form";
import { FormSchemaType } from "./FormSchema";
import { Textarea } from "@/components/ui/textarea";
import MultipleSelector, { Option } from "@/components/ui/multiple-select";

const tagOptions: Option[] = [
  {
    value: "materials-science",
    label: "Materials Science",
    group: "Physical Sciences",
  },
  { value: "chemistry", label: "Chemistry", group: "Physical Sciences" },
  { value: "physics", label: "Physics", group: "Physical Sciences" },
  { value: "drug-discovery", label: "Drug Discovery", group: "Life Sciences" },
  { value: "astrophysics", label: "Astrophysics", group: "Physical Sciences" },
  {
    value: "earth-sciences",
    label: "Earth Sciences",
    group: "Physical Sciences",
  },
  { value: "biology", label: "Biology", group: "Life Sciences" },
  { value: "bioinformatics", label: "Bioinformatics", group: "Life Sciences" },
  { value: "neuroscience", label: "Neuroscience", group: "Life Sciences" },
  { value: "engineering", label: "Engineering", group: "Applied Sciences" },
  {
    value: "energy-systems",
    label: "Energy Systems",
    group: "Applied Sciences",
  },
  {
    value: "agricultural-science",
    label: "Agricultural Science",
    group: "Applied Sciences",
  },
  {
    value: "computer-science",
    label: "Computer Science",
    group: "Computer Sciences",
  },
  {
    value: "cybersecurity",
    label: "Cybersecurity",
    group: "Computer Sciences",
  },
  { value: "manufacturing", label: "Manufacturing", group: "Applied Sciences" },
];

export const Step1 = () => {
  const form = useFormContext() as UseFormReturn<FormSchemaType>;
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">General</h2>
        <p className="text-sm text-gray-700">
          General information about your Garden.
        </p>
      </div>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Garden Title *</FormLabel>
            <FormControl>
              <Input placeholder="My Garden" {...field} />
            </FormControl>
            <FormDescription>
              This is your Garden's public display name.
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
            <FormLabel>Description *</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Tell us about your garden"
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormDescription>
              A high level overview of your Garden, its purpose, and its
              contents. This will be displayed on the Garden page and appear in
              search results.
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
            <FormLabel>
              Tags <span className="text-gray-500">(optional)</span>
            </FormLabel>
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
              />
            </FormControl>
            <FormDescription>
              Tags to help categorize and improve the discoverability your
              Garden.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
