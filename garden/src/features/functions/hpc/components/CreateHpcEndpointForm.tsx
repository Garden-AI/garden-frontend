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
} from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { useCreateHpcEndpoint } from "../api/useCreateHpcEndpoint";
import { HpcEndpointResponse } from "@/types";

const hpcEndpointSchema = z.object({
  name: z.string().min(1, "Name is required"),
  gcmu_id: z.string().min(0),
});

type HpcEndpointFormData = z.infer<typeof hpcEndpointSchema>;

interface CreateHpcEndpointFormProps {
  onSuccess?: (endpoint?: HpcEndpointResponse) => void;
}

export const CreateHpcEndpointForm: React.FC<CreateHpcEndpointFormProps> = ({ onSuccess }) => {
  const { mutateAsync: createEndpoint, isPending } = useCreateHpcEndpoint();

  const form = useForm<HpcEndpointFormData>({
    resolver: zodResolver(hpcEndpointSchema),
    defaultValues: {
      name: "",
      gcmu_id: "",
    },
  });

  const onSubmit = async (values: HpcEndpointFormData) => {
    try {
      const createdEndpoint = await createEndpoint(values);
      toast.success("HPC endpoint added successfully!");
      form.reset();
      onSuccess?.(createdEndpoint);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add HPC endpoint");
    }
  };

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-bold">Add HPC Endpoint</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endpoint Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Polaris, Perlmutter" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gcmu_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Globus Compute Endpoint ID</FormLabel>
                <FormControl>
                  <Input placeholder="UUID of the Globus Compute endpoint" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add Endpoint"}
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
