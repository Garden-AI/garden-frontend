import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import { Textarea } from "@/components/shadcn/textarea";
import MultipleSelector from "@/components/shadcn/multiple-select";
import SyntaxHighlighterComponent from "@/components/SyntaxHighlighter";
import { useFieldArray } from "react-hook-form";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import PaperModal from "@/features/entrypoints/components/modals/PaperModal";
import RepositoryModal from "@/features/entrypoints/components/modals/RepositoryModal";
import DatasetModal from "@/features/entrypoints/components/modals/DatasetModal";
import AssociatedMaterialsGrid from "@/features/entrypoints/components/AssociatedMaterialsGrid";

const EditModalFunctionFormFields = () => {
  const form = useFormContext();
  const exampleUsage = form.watch("example_usage");
  const completeExampleText = `from garden_ai import GardenClient
client = GardenClient()
my_garden = client.get_garden(my_garden_doi)

${exampleUsage || `input = ['Data Here']
return my_garden.function_name(input)`}`;

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-6 border-b pb-2 text-xl font-bold text-gray-800">General</h2>
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-gray-700">Function Title</FormLabel>
                <FormControl>
                  <Input placeholder="My Function" {...field} className="w-full" />
                </FormControl>
                <FormDescription>Your function's public display name.</FormDescription>
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
                    placeholder="Tell us about your function"
                    className="min-h-[100px] w-full resize-vertical"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide a high-level overview of your function, its purpose, and how it works.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="example_usage"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-gray-700">Example Usage</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Show how to use this function"
                    className="min-h-[150px] w-full resize-vertical font-mono"
                    {...field}
                    onKeyDown={(e) => {
                      // Handle tab key for indentation
                      if (e.key === 'Tab') {
                        e.preventDefault();
                        const start = e.currentTarget.selectionStart;
                        const end = e.currentTarget.selectionEnd;
                        const value = e.currentTarget.value;
                        e.currentTarget.value = value.substring(0, start) + '    ' + value.substring(end);
                        e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 4;
                        field.onChange(e.currentTarget.value);
                      }
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Provide an example of how to use this function in Python code. The preview below will be displayed on your function page.
                </FormDescription>
                {/* Always show preview with complete example */}
                <div className="mt-4">
                  <div className="mb-2 text-sm font-semibold text-gray-700">Preview:</div>
                  <div className="rounded-md border bg-gray-50 p-4">
                    <SyntaxHighlighterComponent>
                      {completeExampleText}
                    </SyntaxHighlighterComponent>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-gray-700">Year</FormLabel>
                <FormControl>
                  <Input placeholder="2024" {...field} className="w-full md:w-32" />
                </FormControl>
                <FormDescription>The year this function was created.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-6 border-b pb-2 text-xl font-bold text-gray-800">Details</h2>
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
                  List the main researchers involved in developing this function.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-6 border-b pb-2 text-xl font-bold text-gray-800">Associated Materials</h2>
        <div className="space-y-8">
          <AssociatedMaterialsSection fieldName="papers" resourceType="paper" />
          <AssociatedMaterialsSection fieldName="repositories" resourceType="repository" />
          <AssociatedMaterialsSection fieldName="datasets" resourceType="dataset" />
        </div>
      </section>
    </div>
  );
};

interface AssociatedMaterialsSectionProps {
  resourceType: string;
  fieldName: string;
}

const AssociatedMaterialsSection = ({ fieldName, resourceType }: AssociatedMaterialsSectionProps) => {
  const { control } = useFormContext();
  const { fields, append, update, remove } = useFieldArray({
    control,
    name: fieldName,
  });

  const Modal = () => {
    switch (resourceType) {
      case "repository":
        return (
          <RepositoryModal
            onSave={(data) => append(data)}
            trigger={
              <Button type="button" variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                New {resourceType}
              </Button>
            }
          />
        );
      case "dataset":
        return (
          <DatasetModal
            onSave={(data) => append(data)}
            trigger={
              <Button type="button" variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                New {resourceType}
              </Button>
            }
          />
        );
      case "paper":
        return (
          <PaperModal
            onSave={(data) => append(data)}
            trigger={
              <Button type="button" variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                New {resourceType}
              </Button>
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold capitalize">{fieldName}</h3>
        <Modal />
      </div>
      <AssociatedMaterialsGrid fields={fields} onUpdate={update} onDelete={remove} />
    </div>
  );
};

export default EditModalFunctionFormFields; 