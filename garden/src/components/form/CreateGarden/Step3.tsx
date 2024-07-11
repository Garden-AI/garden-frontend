import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn, useFormContext } from "react-hook-form";
import { FormSchemaType } from "./FormSchema";
import MultipleSelector from "@/components/ui/multiple-select";

export const Step3 = () => {
  const form = useFormContext() as UseFormReturn<FormSchemaType>;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Contributors</h2>
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
              />
            </FormControl>
            <FormDescription>
              The main researchers involved in producing the Garden. At least
              one author is required in order to register a DOI.
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
              />
            </FormControl>
            <FormDescription>
              Acknowledge contributors to the development of this Garden,
              outside of those listed as authors.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
