import { Code } from "lucide-react";
import { Input } from "@/components/shadcn/input";
import { Textarea } from "@/components/shadcn/textarea";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/shadcn/form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/shadcn/accordion";
import { UseFormReturn } from "react-hook-form";
import { ModalFileMetadataResponse } from "@/types";
import { ModalAppFormValues } from "@/features/functions/modal/api/useModalAppForm";
import SyntaxHighlighter from "@/components/SyntaxHighlighter";

// Example usage templates for Modal functions
const getExampleUsagePlaceholder = (functionName: string = "function_name") => `
# Example of how to use this function
input_data = ['data']

# Call the function
result = my_garden.${functionName}(input_data)

# Return the result
return result
`.trim();

const getExampleUsagePreview = (functionName: string = "function_name", userValue?: string) => {
  const defaultExample = getExampleUsagePlaceholder(functionName);

  return `
from garden_ai import GardenClient
client = GardenClient()
my_garden = client.get_garden(my_garden_doi)

${userValue || defaultExample}
  `.trim();
};

interface FunctionMetadataEditorProps {
  form: UseFormReturn<ModalAppFormValues>;
  metadata: ModalFileMetadataResponse;
  handleFunctionMetadataChange: (
    functionIndex: number,
    field: string,
    value: string,
    event?: React.KeyboardEvent<HTMLTextAreaElement>
  ) => void;
}

export const FunctionMetadataEditor = ({
  form,
  metadata,
  handleFunctionMetadataChange
}: FunctionMetadataEditorProps) => (
  <div className="rounded-lg border">
    <div className="border-b bg-gray-50 p-4">
      <h3 className="text-lg font-semibold">Edit Function Details</h3>
      <p className="text-sm text-gray-600">
        Customize how your functions will appear in the Garden
        <p className="text-xs text-gray-500">(You can edit these details later)</p>
      </p>
    </div>
    <div className="p-4">
      <Accordion type="single" collapsible className="w-full">
        {metadata.modal_functions?.map((func, i) => (
          <AccordionItem key={i} value={`func-${i}`}>
            <AccordionTrigger className="px-4 hover:bg-gray-50">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                <span>{func.function_name}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 px-4 pt-4">
              <FormField
                control={form.control}
                name={`modal.modal_functions.${i}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Function Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Function Title" />
                    </FormControl>
                    <FormDescription>
                      A descriptive title for your function
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`modal.modal_functions.${i}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Describe what this function does..."
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormDescription>
                      Explain what your function does and how it should be used
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`modal.modal_functions.${i}.example_usage`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Example Usage</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder={getExampleUsagePlaceholder(func.function_name)}
                        className="min-h-[150px] font-mono"
                        onChange={(e) => {
                          handleFunctionMetadataChange(i, 'example_usage', e.target.value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Tab') {
                            e.preventDefault();
                            handleFunctionMetadataChange(
                              i,
                              'example_usage',
                              field.value,
                              e as React.KeyboardEvent<HTMLTextAreaElement>
                            );
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide example code for using this function
                    </FormDescription>
                    <FormMessage />
                    {/* Always show preview with complete example */}
                    <div className="mt-4">
                      <div className="mb-2 text-sm font-semibold text-gray-700">Preview:</div>
                      <div className="rounded-md border bg-gray-50 p-4">
                        <SyntaxHighlighter>
                          {getExampleUsagePreview(func.function_name, field.value)}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`modal.modal_functions.${i}.function_text`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Function Code</FormLabel>
                    <div className="max-h-60 overflow-auto rounded border">
                      <SyntaxHighlighter>
                        {field.value}
                      </SyntaxHighlighter>
                    </div>
                    <FormDescription>
                      This is the original function code (read-only)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </div>
); 