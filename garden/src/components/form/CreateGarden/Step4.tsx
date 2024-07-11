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
import { Input } from "@/components/ui/input";

export const Step4 = () => {
  const form = useFormContext() as UseFormReturn<FormSchemaType>;
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Miscellaneous</h2>

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
    </div>
  );
};
