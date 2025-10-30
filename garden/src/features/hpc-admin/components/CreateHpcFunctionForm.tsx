import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { useCreateHpcFunction } from "../api/useCreateHpcFunction";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Upload, Code, FileCode } from "lucide-react";
import { parseHpcFunctions, functionNameToTitle } from "../utils/parseHpcFunctions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/shadcn/accordion";
import { Textarea } from "@/components/shadcn/textarea";
import SyntaxHighlighter from "@/components/SyntaxHighlighter";

const hpcFunctionSchema = z.object({});

type HpcFunctionFormData = z.infer<typeof hpcFunctionSchema>;

interface SelectedFunction {
  functionName: string;
  title: string;
  description: string;
  selected: boolean;
}

interface CreateHpcFunctionFormProps {
  onSuccess?: (createdFunctionIds?: number[]) => void;
}

export const CreateHpcFunctionForm: React.FC<CreateHpcFunctionFormProps> = ({ onSuccess }) => {
  const { mutateAsync: createFunction, isPending } = useCreateHpcFunction();
  const [functionCode, setFunctionCode] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [parsedFunctions, setParsedFunctions] = useState<SelectedFunction[]>([]);

  const handleFile = async (file: File) => {
    if (file.type === "text/x-python" || file.name.endsWith(".py")) {
      const text = await file.text();
      setFunctionCode(text);
      setUploadedFileName(file.name);

      // Parse functions from the uploaded code
      const functions = parseHpcFunctions(text);

      if (functions.length === 0) {
        toast.warning(`Loaded ${file.name}, but no @hog.function() decorated functions found`);
        setParsedFunctions([]);
      } else {
        // Create SelectedFunction objects with auto-generated titles
        const selectedFunctions: SelectedFunction[] = functions.map(fn => ({
          functionName: fn.name,
          title: functionNameToTitle(fn.name),
          description: "",
          selected: true, // Select all by default
        }));
        setParsedFunctions(selectedFunctions);
        toast.success(`Loaded ${file.name} - found ${functions.length} function${functions.length > 1 ? 's' : ''}`);
      }
    } else {
      toast.error("Please upload a Python (.py) file");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set dragging to false if we're leaving the container entirely
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      await handleFile(file);
    }
  };

  const form = useForm<HpcFunctionFormData>({
    resolver: zodResolver(hpcFunctionSchema),
    defaultValues: {},
  });

  const onSubmit = async (values: HpcFunctionFormData) => {
    if (!functionCode.trim()) {
      toast.error("Function code is required");
      return;
    }

    // Get selected functions
    const selectedFunctions = parsedFunctions.filter(fn => fn.selected);

    if (selectedFunctions.length === 0) {
      toast.error("Please select at least one function to create");
      return;
    }

    try {
      // Create each selected function
      const createPromises = selectedFunctions.map(fn => {
        const requestData = {
          title: fn.title,
          function_name: fn.functionName,
          endpoint_ids: [],
          function_text: functionCode,
          description: fn.description.trim() || null,
          year: new Date().getFullYear().toString(),
          is_archived: false,
          authors: [],
          tags: [],
          test_functions: [],
          requirements: [],
          models: [],
          repositories: [],
          papers: [],
          datasets: [],
          notebooks: [],
        };
        return createFunction(requestData);
      });

      const results = await Promise.all(createPromises);
      const createdIds = results.map(result => result.id);

      const count = selectedFunctions.length;
      toast.success(`Successfully created ${count} HPC function${count > 1 ? 's' : ''}!`);

      // Reset form
      form.reset();
      setFunctionCode("");
      setUploadedFileName("");
      setParsedFunctions([]);
      onSuccess?.(createdIds);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create HPC functions");
    }
  };

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-bold">Add HPC Functions</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-1">
            <FormLabel>Upload groundhog-hpc Script</FormLabel>
            <FormDescription>Upload a Python file containing @hog.function() decorated functions</FormDescription>
            <div
              className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors cursor-pointer ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <div className="space-y-3">
                <p className="text-sm font-medium">
                  Drag and drop your Python file here
                </p>
                <div className="flex items-center justify-center gap-2">
                  <div className="h-px w-16 bg-border" />
                  <span className="text-xs text-muted-foreground">or</span>
                  <div className="h-px w-16 bg-border" />
                </div>
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                  >
                    Click to Browse
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".py"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      await handleFile(file);
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Supports .py files only
                </p>
              </div>
              {functionCode && (
                <div className="mt-4 text-sm text-green-600 font-medium">
                  ✓ File loaded ({functionCode.length} characters)
                </div>
              )}
            </div>
          </div>

          {/* Display uploaded code - Collapsible */}
          {functionCode && (
            <Card className="bg-gray-50">
              <Accordion type="single" collapsible>
                <AccordionItem value="source-code" className="border-none">
                  <AccordionTrigger className="px-4 hover:bg-gray-100">
                    <div className="flex items-center gap-2">
                      <FileCode className="h-5 w-5" />
                      <span className="font-medium">Uploaded Script</span>
                      {uploadedFileName && (
                        <span className="text-sm text-muted-foreground">({uploadedFileName})</span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="max-h-96 overflow-auto rounded border bg-white">
                      <SyntaxHighlighter>
                        {functionCode}
                      </SyntaxHighlighter>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          )}

          {/* Parsed Functions Section */}
          {parsedFunctions.length > 0 && (
            <div className="rounded-lg border">
              <div className="border-b bg-gray-50 p-4">
                <h3 className="text-lg font-semibold">Edit Function Details</h3>
                <p className="text-sm text-gray-600">
                  Found {parsedFunctions.length} @hog.function() decorated function{parsedFunctions.length > 1 ? 's' : ''}.
                  Select and customize the functions you want to create.
                </p>
              </div>
              <div className="p-4">
                <Accordion type="multiple" className="w-full">
                  {parsedFunctions.map((fn, index) => (
                    <AccordionItem key={fn.functionName} value={`func-${index}`}>
                      <AccordionTrigger className="px-4 hover:bg-gray-50">
                        <div className="flex items-center gap-3 w-full">
                          <Checkbox
                            checked={fn.selected}
                            onCheckedChange={(checked) => {
                              const updated = [...parsedFunctions];
                              updated[index].selected = !!checked;
                              setParsedFunctions(updated);
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <Code className="h-4 w-4" />
                          <span className="font-mono">{fn.functionName}</span>
                          {!fn.selected && (
                            <span className="ml-auto text-xs text-muted-foreground">(Deselected)</span>
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 px-4 pt-4">
                        <div className="space-y-1">
                          <label className="text-sm font-medium">Function Name</label>
                          <code className="block rounded bg-muted px-3 py-2 text-sm font-mono">
                            {fn.functionName}
                          </code>
                          <p className="text-xs text-muted-foreground">
                            The Python function name (read-only)
                          </p>
                        </div>

                        <div className="space-y-1">
                          <label className="text-sm font-medium">Title *</label>
                          <Input
                            value={fn.title}
                            onChange={(e) => {
                              const updated = [...parsedFunctions];
                              updated[index].title = e.target.value;
                              setParsedFunctions(updated);
                            }}
                            placeholder="Function title"
                          />
                          <p className="text-xs text-muted-foreground">
                            A descriptive title for your function
                          </p>
                        </div>

                        <div className="space-y-1">
                          <label className="text-sm font-medium">Description (Optional)</label>
                          <Textarea
                            value={fn.description}
                            onChange={(e) => {
                              const updated = [...parsedFunctions];
                              updated[index].description = e.target.value;
                              setParsedFunctions(updated);
                            }}
                            placeholder="Describe what this function does..."
                            className="min-h-[100px]"
                          />
                          <p className="text-xs text-muted-foreground">
                            Explain what your function does and how it should be used
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={isPending || parsedFunctions.filter(fn => fn.selected).length === 0}
          >
            {isPending
              ? `Creating ${parsedFunctions.filter(fn => fn.selected).length} function${parsedFunctions.filter(fn => fn.selected).length !== 1 ? 's' : ''}...`
              : parsedFunctions.filter(fn => fn.selected).length > 0
                ? `Create ${parsedFunctions.filter(fn => fn.selected).length} Function${parsedFunctions.filter(fn => fn.selected).length !== 1 ? 's' : ''}`
                : 'Create Functions'}
          </Button>
        </form>
      </Form>
    </div>
  );
};
