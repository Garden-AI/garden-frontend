import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ZodSchema, z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EntrypointCreateRequest } from "@/api/types";
import { useCreateEntrypoint, useGreetings } from "@/api";
import { useNavigate } from "react-router-dom";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";

const formSchema = z.object({
  doi: z.string(),
  doi_is_draft: z.boolean(),
  title: z.string(),
  description: z.string(),
  publisher: z.string(),
  year: z.string(),
  func_uuid: z.string(),
  base_image_uri: z.string(),
  full_image_uri: z.string(),
  notebook_url: z.string(),
  container_uuid: z.string(),
  short_name: z.string(),
  function_text: z.string(),
  authors: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  test_functions: z.array(z.string()).optional(),
  owner_identity_id: z.string(),
  models: z
    .array(
      z.object({
        model_identifier: z.string(),

        model_repository: z.string(),
        model_version: z.string().nullable(),
      }),
    )
    .optional(),

  repositories: z
    .array(
      z.object({
        repo_name: z.string(),
        url: z.string(),
        contributors: z.array(z.string()).optional(),
      }),
    )
    .optional(),

  papers: z
    .array(
      z.object({
        title: z.string(),
        authors: z.array(z.string()).optional(),
        doi: z.string().nullable(),
        citation: z.string().nullable(),
      }),
    )
    .optional(),

  datasets: z
    .array(
      z.object({
        title: z.string(),
        doi: z.string().nullable(),
        url: z.string(),
        data_type: z.string().nullable(),
        repository: z.string(),
      }),
    )
    .optional(),
}) satisfies ZodSchema<EntrypointCreateRequest>;

export default function CreateEntrypointForm() {
  const navigate = useNavigate();
  const createEntrypoint = useCreateEntrypoint();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      authors: [],
      doi: "",
      doi_is_draft: true,
      description: "",
      publisher: "",
      year: "2024",

      func_uuid: "",
      base_image_uri: "",
      full_image_uri: "",
      notebook_url: "",
      short_name: "",
      function_text: "",
      tags: [],
      test_functions: [],
      owner_identity_id: "",
      models: [],
      repositories: [],
      papers: [],
      datasets: [],
    },
  });

  function onSaveAsDraft() {
    return onSubmit({ ...form.getValues(), doi_is_draft: true });
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    createEntrypoint.mutate(values);

    // if successful redirect to the new garden
    if (createEntrypoint.isSuccess) {
      // redirect to the new entrypoint
      toast.success("Entrypoint created successfully!");
      navigate(`/garden/${createEntrypoint.data.doi}`);
    } else {
      toast.warning("Error creating garden. Please fix errors.");
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-center text-3xl">Create a Entrypoint</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entrypoint Name</FormLabel>
                <FormControl>
                  <Input placeholder="My Entrypoint" {...field} />
                </FormControl>
                <FormDescription>
                  This is your Entrypoint's public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entrypoint Name</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about your garden"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  A short description of your Entrypoint.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="doi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>DOI</FormLabel>
                <FormControl>
                  <Input placeholder="10.1234/abcd" {...field} />
                </FormControl>
                <FormDescription>
                  A unique identifier for your Entrypoint.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="publisher"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Publisher</FormLabel>
                <FormControl>
                  <Input placeholder="Publisher" {...field} />
                </FormControl>
                <FormDescription>
                  The publisher of your Entrypoint.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <Input placeholder="tag1, tag2" {...field} />
                </FormControl>
                <FormDescription>
                  Tags to help categorize your Entrypoint.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
          <Button type="button" variant="secondary" onClick={onSaveAsDraft}>
            Save as Draft
          </Button>
        </form>
      </Form>
    </div>
  );
}
