import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
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
import { useFormContext, useFieldArray } from "react-hook-form";

const ModalFunctions = () => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name: "modal_functions",
    control,
  });

  return (
    <div className="space-y-8">
      {fields.map((func, index) => (
        <ModalFunction key={func.id} index={index} remove={() => remove(index)} />
      ))}
      <Button
        type="button"
        onClick={() => {
          append({
            function_name: "",
            description: "",
            year: "2024",
            is_archived: false,
            doi: "fake_doi",
            title: "",
          });
        }}
      >
        Add Function
      </Button>
    </div>
  );
};

const ModalFunction = ({ index, remove }: { index: number; remove: () => void }) => {
  const { control } = useFormContext();

  return (
    <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800">Modal Function #{index + 1}</h3>
        {index > 0 && (
          <Button variant="destructive" onClick={remove} size="sm">
            Remove
          </Button>
        )}
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name={`modal_functions.${index}.title`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold text-gray-700">Title</FormLabel>
              <FormControl>
                <Input {...field} type="text" className="w-full" placeholder="My Modal Function" />
              </FormControl>
              <FormDescription className="text-xs">
                The title of your modal function. This will be displayed on the modal function page
                and appear in search results.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`modal_functions.${index}.year`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold text-gray-700">Year</FormLabel>
              <FormControl>
                <Input {...field} type="text" className="w-full" placeholder="2024" />
              </FormControl>
              <FormMessage />
              <FormDescription className="text-xs">
                The year this modal function was created.
              </FormDescription>
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name={`modal_functions.${index}.function_name`}
        render={({ field }) => (
          <FormItem className="mb-4">
            <FormLabel className="font-bold text-gray-700">Function Name</FormLabel>
            <FormControl>
              <Input {...field} type="text" className="w-full" placeholder="my_function" />
            </FormControl>
            <FormMessage />
            <FormDescription className="text-xs">The Python name of your function.</FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`modal_functions.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-bold text-gray-700">Description</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="A function that does something cool"
                className="h-32 w-full resize-none"
              />
            </FormControl>
            <FormDescription className="text-xs">
              A high level overview of your modal function, its purpose, and its contents. This will
              be displayed on the modal function page and appear in search results.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ModalFunctions;
