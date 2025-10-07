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

const hpcFunctionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  function_name: z.string().min(1, "Function name is required"),
  function_text: z.string().optional(), // Handled separately via state
  description: z.string().nullable().optional(), // Handled separately via state
  year: z.string().min(4, "Year is required"),
  authors: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  deployment_ids: z.array(z.number()).min(1, "At least one deployment is required"),
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

  const form = useForm<HpcFunctionFormData>({
    resolver: zodResolver(hpcFunctionSchema),
    defaultValues: {
      title: "",
      function_name: "",
      function_text: "",
      description: "",
      year: new Date().getFullYear().toString(),
      authors: [],
      tags: [],
      deployment_ids: [],
    },
  });

  const onSubmit = async (values: HpcFunctionFormData) => {
    // Validate function code is not empty
    if (!functionCode || functionCode.trim() === "") {
      toast.error("Function code is required");
      return;
    }

    try {
      const requestData = {
        ...values,
        function_text: functionCode,
        description: description || null,
        is_archived: false,
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
            <EditableCodeField
              label="Python"
              language="python"
              fieldName="function_text"
              onSave={async (value) => {
                setFunctionCode(value);
              }}
              onEdit={(value) => {
                // Update internal state but don't trigger re-render
                setFunctionCode(value);
              }}
              value={functionCode}
              ownsThisEntity={true}
              editing={true}
              showSaveButton={false}
            />
          </div>

          <div className="space-y-1">
            <FormLabel>Description (Optional)</FormLabel>
            <EditableCodeField
              label="Markdown"
              language="markdown"
              fieldName="description"
              onSave={async (value) => {
                setDescription(value);
              }}
              onEdit={(value) => {
                setDescription(value);
              }}
              value={description}
              ownsThisEntity={true}
              editing={true}
              showSaveButton={false}
            />
          </div>

          <FormField
            control={form.control}
            name="deployment_ids"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>Deployments</FormLabel>
                  <FormDescription>
                    Select at least one deployment for this function
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

          <div className="flex gap-4">
            <Button type="submit" disabled={isPending || deploymentsLoading}>
              {isPending ? "Adding..." : "Add Function"}
            </Button>
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Reset
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
