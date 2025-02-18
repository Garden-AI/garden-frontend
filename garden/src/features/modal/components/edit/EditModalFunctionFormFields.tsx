import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MultipleSelector from "@/components/ui/multiple-select";
import SyntaxHighlighterComponent from "@/components/SyntaxHighlighter";

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
                  <Input placeholder="My Function" {...field} className="w-full max-w-2xl" />
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
                    className="min-h-[100px] w-full max-w-2xl resize-vertical"
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
        </div>
      </section>

      <section>
        <h2 className="mb-6 border-b pb-2 text-xl font-bold text-gray-800">Contributors</h2>
        <div className="space-y-6">
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
                    className="w-full max-w-2xl"
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
                    className="w-full max-w-2xl"
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
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-gray-700">Year</FormLabel>
                <FormControl>
                  <Input placeholder="2024" {...field} className="w-full max-w-xs" />
                </FormControl>
                <FormDescription>The year this function was created.</FormDescription>
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
                    className="min-h-[150px] w-full max-w-2xl resize-vertical font-mono"
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
                <div className="mt-2">
                  <div className="text-sm font-semibold text-gray-700">Preview:</div>
                  <SyntaxHighlighterComponent>
                    {completeExampleText}
                  </SyntaxHighlighterComponent>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </section>
    </div>
  );
};

export default EditModalFunctionFormFields; 