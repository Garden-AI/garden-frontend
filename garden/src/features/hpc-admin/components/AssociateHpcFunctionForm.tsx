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
import { Button } from "@/components/shadcn/button";
import { useHpcFunctions } from "../api/useHpcFunctions";
import { useUpdateGarden } from "@/features/gardens/api/useUpdateGarden";
import { Checkbox } from "@/components/shadcn/checkbox";
import { GardenMetadataResponse } from "@/types";

const associateHpcFunctionSchema = z.object({
  hpc_function_ids: z.array(z.number()).min(1, "Select at least one HPC function"),
});

type AssociateHpcFunctionFormData = z.infer<typeof associateHpcFunctionSchema>;

interface AssociateHpcFunctionFormProps {
  garden: GardenMetadataResponse;
  onSuccess?: () => void;
}

export const AssociateHpcFunctionForm: React.FC<AssociateHpcFunctionFormProps> = ({
  garden,
  onSuccess,
}) => {
  const { data: hpcFunctions, isLoading: functionsLoading } = useHpcFunctions();
  const { mutateAsync: updateGarden, isPending } = useUpdateGarden(garden.doi);

  const form = useForm<AssociateHpcFunctionFormData>({
    resolver: zodResolver(associateHpcFunctionSchema),
    defaultValues: {
      hpc_function_ids: garden.hpc_function_ids || [],
    },
  });

  const onSubmit = async (values: AssociateHpcFunctionFormData) => {
    try {
      await updateGarden({
        hpc_function_ids: values.hpc_function_ids,
      });
      toast.success("HPC functions associated successfully!");
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to associate HPC functions");
    }
  };

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-bold">
        Associate HPC Functions with {garden.title}
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="hpc_function_ids"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>HPC Functions</FormLabel>
                  <FormDescription>
                    Select the HPC functions to associate with this garden
                  </FormDescription>
                </div>
                {functionsLoading ? (
                  <p className="text-sm text-muted-foreground">Loading HPC functions...</p>
                ) : hpcFunctions && hpcFunctions.length > 0 ? (
                  <div className="space-y-3">
                    {hpcFunctions.map((func) => (
                      <FormField
                        key={func.id}
                        control={form.control}
                        name="hpc_function_ids"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={func.id}
                              className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(func.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, func.id])
                                      : field.onChange(
                                          field.value?.filter((value) => value !== func.id)
                                        );
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="font-medium">
                                  {func.title}
                                </FormLabel>
                                <p className="text-sm text-muted-foreground">
                                  {func.function_name} - {func.description || "No description"}
                                </p>
                              </div>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No HPC functions available. Create an HPC function first.
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <Button type="submit" disabled={isPending || functionsLoading}>
              {isPending ? "Updating..." : "Update Garden"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
