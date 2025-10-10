import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { useCreateHpcFunction } from "../api/useCreateHpcFunction";
import { useHpcDeployments } from "../api/useHpcDeployments";
import { Checkbox } from "@/components/shadcn/checkbox";
import { EditableCodeField } from "@/components/EditableCodeField";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { Upload } from "lucide-react";

const hpcFunctionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  function_name: z.string().min(1, "Function name is required"),
  deployment_ids: z.array(z.number()).optional(),
});

type HpcFunctionFormData = z.infer<typeof hpcFunctionSchema>;

interface CreateHpcFunctionFormProps {
  onSuccess?: () => void;
}

export const CreateHpcFunctionForm: React.FC<CreateHpcFunctionFormProps> = ({ onSuccess }) => {
  const { mutateAsync: createFunction, isPending } = useCreateHpcFunction();
  const { data: deployments, isLoading: deploymentsLoading } = useHpcDeployments();
  const [functionCode, setFunctionCode] = useState("");
  const [description, setDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (file.type === "text/x-python" || file.name.endsWith(".py")) {
      const text = await file.text();
      setFunctionCode(text);
      toast.success(`Loaded ${file.name}`);
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
    defaultValues: {
      title: "",
      function_name: "",
      deployment_ids: [],
    },
  });

  const onSubmit = async (values: HpcFunctionFormData) => {
    if (!functionCode.trim()) {
      toast.error("Function code is required");
      return;
    }

    try {
      const requestData = {
        ...values,
        function_text: functionCode,
        description: description || null,
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

      await createFunction(requestData);
      toast.success("HPC function added successfully!");
      form.reset();
      setFunctionCode("");
      setDescription("");
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add HPC function");
    }
  };

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-bold">Add HPC Function</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Function title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="function_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Function Name</FormLabel>
                <FormControl>
                  <Input placeholder="my_hpc_function" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-1">
            <FormLabel>Function Source</FormLabel>
            <FormDescription>Python code for the HPC function</FormDescription>
            <Tabs defaultValue="file" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="file">Upload File</TabsTrigger>
                <TabsTrigger value="text">Text Input</TabsTrigger>
              </TabsList>

              <TabsContent value="file" className="mt-4">
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
              </TabsContent>

              <TabsContent value="text" className="mt-4">
                <EditableCodeField
                  label="Python"
                  language="python"
                  fieldName="function_text"
                  onEdit={setFunctionCode}
                  value={functionCode}
                  ownsThisEntity
                  editing
                  showSaveButton={false}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-1">
            <FormLabel>Description (Optional)</FormLabel>
            <EditableCodeField
              label="Markdown"
              language="markdown"
              fieldName="description"
              onEdit={setDescription}
              value={description}
              ownsThisEntity
              editing
              showSaveButton={false}
            />
          </div>

          <FormField
            control={form.control}
            name="deployment_ids"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>Deployments (Optional)</FormLabel>
                  <FormDescription>
                    Select deployments for this function. You can add deployments later if needed.
                  </FormDescription>
                </div>
                {deploymentsLoading ? (
                  <p className="text-sm text-muted-foreground">Loading deployments...</p>
                ) : deployments && deployments.length > 0 ? (
                  <div className="space-y-2">
                    {deployments.map((deployment) => (
                      <FormField
                        key={deployment.id}
                        control={form.control}
                        name="deployment_ids"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={deployment.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(deployment.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, deployment.id])
                                      : field.onChange(
                                          field.value?.filter((value) => value !== deployment.id)
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Deployment {deployment.id}
                                {deployment.conda_env_path && ` - ${deployment.conda_env_path}`}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No deployments available. Add a deployment first.
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending}>
            {isPending ? "Adding..." : "Add Function"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
