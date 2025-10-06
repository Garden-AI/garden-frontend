import React from "react";
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
import { Checkbox } from "@/components/shadcn/checkbox";
import { useCreateHpcDeployment } from "../api/useCreateHpcDeployment";
import { useHpcEndpoints } from "../api/useHpcEndpoints";

const hpcDeploymentSchema = z.object({
  conda_env_path: z.string().optional().nullable(),
  endpoint_ids: z.array(z.number()).min(1, "Select at least one endpoint"),
});

type HpcDeploymentFormData = z.infer<typeof hpcDeploymentSchema>;

interface CreateHpcDeploymentFormProps {
  onSuccess?: () => void;
}

export const CreateHpcDeploymentForm: React.FC<CreateHpcDeploymentFormProps> = ({ onSuccess }) => {
  const { mutateAsync: createDeployment, isPending } = useCreateHpcDeployment();
  const { data: endpoints, isLoading: endpointsLoading } = useHpcEndpoints();

  const form = useForm<HpcDeploymentFormData>({
    resolver: zodResolver(hpcDeploymentSchema),
    defaultValues: {
      conda_env_path: "",
      endpoint_ids: [],
    },
  });

  const onSubmit = async (values: HpcDeploymentFormData) => {
    try {
      await createDeployment(values);
      toast.success("HPC deployment created successfully!");
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create HPC deployment");
    }
  };

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-bold">Create HPC Deployment</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="conda_env_path"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Conda Environment Path (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="/path/to/conda/env"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endpoint_ids"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>HPC Endpoints</FormLabel>
                  <FormDescription>
                    Select at least one endpoint for this deployment
                  </FormDescription>
                </div>
                {endpointsLoading ? (
                  <p className="text-sm text-muted-foreground">Loading endpoints...</p>
                ) : endpoints && endpoints.length > 0 ? (
                  <div className="space-y-2">
                    {endpoints.map((endpoint) => (
                      <FormField
                        key={endpoint.id}
                        control={form.control}
                        name="endpoint_ids"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={endpoint.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(endpoint.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, endpoint.id])
                                      : field.onChange(
                                          field.value?.filter((value) => value !== endpoint.id)
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {endpoint.name} - {endpoint.gcmu_id}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No endpoints available. Create an endpoint first.
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <Button type="submit" disabled={isPending || endpointsLoading}>
              {isPending ? "Creating..." : "Create Deployment"}
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
