import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormSchemaType } from "./FormSchema";
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
import { Textarea } from "@/components/ui/textarea";
import MultipleSelector, { Option } from "@/components/ui/multiple-select";
import { Button } from "@/components/ui/button";
import SelectEntrypoints from "./SelectEntrypoints";

interface FormFieldsProps {
  form: UseFormReturn<FormSchemaType>;
  onSubmit: (values: FormSchemaType) => Promise<void>;
  isSubmitting: boolean;
}

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
    value: "social-sciences",
    label: "Social Sciences",
    group: "Social Sciences",
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

export const FormFields: React.FC<FormFieldsProps> = ({
  form,
  onSubmit,
  isSubmitting,
}) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Garden Name</FormLabel>
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your garden"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A short description of your Garden.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <SelectEntrypoints form={form} />

        <FormField
          control={form.control}
          name="authors"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Authors</FormLabel>
              <FormControl>
                <MultipleSelector
                  {...field}
                  placeholder="Add authors"
                  creatable
                />
              </FormControl>
              <FormDescription>
                Authors involved in this garden.
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
              <FormLabel>Contributors</FormLabel>
              <FormControl>
                <MultipleSelector
                  {...field}
                  placeholder="Add contributors"
                  creatable
                />
              </FormControl>
              <FormDescription>Contributors to this work.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="publisher"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Publisher</FormLabel>
              <FormControl>
                <Input placeholder="Publisher" {...field} />
              </FormControl>
              <FormDescription>The publisher of your Garden.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
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
              <FormLabel>Version</FormLabel>
              <FormControl>
                <Input placeholder="1.0.0" {...field} />
              </FormControl>
              <FormDescription>The version of your Garden.</FormDescription>
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
                Tags to help categorize your Garden.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
};
