import SyntaxHighlighterComponent from "@/components/SyntaxHighlighter";
import {
  FormLabel,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GardenCreateFormData } from "../types/garden.types";
import { useFormContext, useFieldArray } from "react-hook-form";

const ModalFunctions = () => {
  const { control } = useFormContext<GardenCreateFormData>();
  const { fields } = useFieldArray({
    name: "modal.modal_functions",
    control,
  });

  return (
    <div className="space-y-8">
      {fields.map((func, index) => (
        <ModalFunction 
          key={func.id} 
          index={index} 
          functionName={func.function_name as string}
        />
      ))}
    </div>
  );
};

const ModalFunction = ({ index, functionName }: { index: number, functionName: string }) => {
  const { control, watch } = useFormContext();

  const functionText = watch(`modal.modal_functions.${index}.function_text`);
  return (
    <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
      <div className="mb-4 ">
        <h3 className="text-xl font-semibold text-gray-800">{functionName}</h3>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name={`modal.modal_functions.${index}.title`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold text-gray-700">Title</FormLabel>
              <FormControl>
                <Input {...field} type="text" className="w-full" placeholder="My Modal Function" />
              </FormControl>
              <FormDescription className="text-xs">
                The title of your function. This will be displayed on the function page
                and appear in search results.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={control}
        name={`modal.modal_functions.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-bold text-gray-700">Description</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="This function takes X kind of input and returns Y kind of output in roughly Z seconds."
                className="h-32 w-full resize-none"
              />
            </FormControl>
            <FormDescription className="text-xs">
              A high level overview of your function, its purpose, and its contents. This will
              be displayed on the function page and appear in search results.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="mt-4">
        <h2 className="mb-4 text-sm font-semibold">Function Text</h2>
        <SyntaxHighlighterComponent>{functionText}</SyntaxHighlighterComponent>
      </div>
    </div>
  );
};

export default ModalFunctions;
